# PriceX Infrastructure as Code
# Terraform configuration for global deployment

terraform {
  required_version = ">= 1.5.0"
  
  required_providers {
    aws = {
      source  = "hashicorp/aws"
      version = "~> 5.0"
    }
    cloudflare = {
      source  = "cloudflare/cloudflare"
      version = "~> 4.0"
    }
    vercel = {
      source  = "vercel/vercel"
      version = "~> 0.15"
    }
  }
  
  backend "s3" {
    bucket         = "pricex-terraform-state"
    key            = "infrastructure/terraform.tfstate"
    region         = "us-east-1"
    encrypt        = true
    dynamodb_table = "pricex-terraform-locks"
  }
}

# ============================================
# GLOBAL VARIABLES
# ============================================

variable "environment" {
  description = "Environment (production, staging, development)"
  type        = string
  default     = "production"
}

variable "domains" {
  description = "Domain names for each region"
  type        = map(string)
  default = {
    "global" = "pricex.com"
    "na"     = "na.pricex.com"
    "sa"     = "sa.pricex.com"
    "eu"     = "eu.pricex.com"
    "mena"   = "mena.pricex.com"
    "asia"   = "asia.pricex.com"
    "africa" = "africa.pricex.com"
    "aus"    = "aus.pricex.com"
  }
}

# ============================================
# AWS PROVIDER - MULTI-REGION
# ============================================

provider "aws" {
  alias  = "us-east-1"
  region = "us-east-1"
}

provider "aws" {
  alias  = "us-west-2"
  region = "us-west-2"
}

provider "aws" {
  alias  = "eu-west-1"
  region = "eu-west-1" # Ireland
}

provider "aws" {
  alias  = "eu-central-1"
  region = "eu-central-1" # Frankfurt
}

provider "aws" {
  alias  = "ap-southeast-1"
  region = "ap-southeast-1" # Singapore
}

provider "aws" {
  alias  = "ap-northeast-1"
  region = "ap-northeast-1" # Tokyo
}

provider "aws" {
  alias  = "ap-south-1"
  region = "ap-south-1" # Mumbai
}

provider "aws" {
  alias  = "sa-east-1"
  region = "sa-east-1" # São Paulo
}

provider "aws" {
  alias  = "af-south-1"
  region = "af-south-1" # Cape Town
}

provider "aws" {
  alias  = "me-south-1"
  region = "me-south-1" # Bahrain
}

# ============================================
# GLOBAL ACM CERTIFICATE
# ============================================

resource "aws_acm_certificate" "global" {
  provider                  = aws.us-east-1
  domain_name               = "pricex.com"
  subject_alternative_names = ["*.pricex.com"]
  validation_method         = "DNS"
  
  tags = {
    Name        = "PriceX Global Certificate"
    Environment = var.environment
  }
  
  lifecycle {
    create_before_destroy = true
  }
}

# ============================================
# CLOUDFRONT CDN - GLOBAL EDGE
# ============================================

resource "aws_cloudfront_distribution" "main" {
  enabled             = true
  is_ipv6_enabled     = true
  comment             = "PriceX Global CDN"
  default_root_object = "index.html"
  price_class         = "PriceClass_All" # Global edge locations
  
  aliases = ["pricex.com", "www.pricex.com"]
  
  origin {
    domain_name = aws_s3_bucket.frontend.bucket_regional_domain_name
    origin_id   = "S3-frontend"
    
    s3_origin_config {
      origin_access_identity = aws_cloudfront_origin_access_identity.main.cloudfront_access_identity_path
    }
  }
  
  origin {
    domain_name = "api.pricex.com"
    origin_id   = "API"
    
    custom_origin_config {
      http_port              = 80
      https_port             = 443
      origin_protocol_policy = "https-only"
      origin_ssl_protocols   = ["TLSv1.2"]
    }
  }
  
  default_cache_behavior {
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "S3-frontend"
    
    forwarded_values {
      query_string = false
      cookies {
        forward = "none"
      }
    }
    
    viewer_protocol_policy = "redirect-to-https"
    min_ttl                = 0
    default_ttl            = 3600
    max_ttl                = 86400
    compress               = true
  }
  
  ordered_cache_behavior {
    path_pattern     = "/api/*"
    allowed_methods  = ["DELETE", "GET", "HEAD", "OPTIONS", "PATCH", "POST", "PUT"]
    cached_methods   = ["GET", "HEAD"]
    target_origin_id = "API"
    
    forwarded_values {
      query_string = true
      headers      = ["Origin", "Access-Control-Request-Headers", "Access-Control-Request-Method"]
      cookies {
        forward = "all"
      }
    }
    
    viewer_protocol_policy = "https-only"
    min_ttl                = 0
    default_ttl            = 0
    max_ttl                = 0
  }
  
  restrictions {
    geo_restriction {
      restriction_type = "none"
    }
  }
  
  viewer_certificate {
    acm_certificate_arn      = aws_acm_certificate.global.arn
    ssl_support_method       = "sni-only"
    minimum_protocol_version = "TLSv1.2_2021"
  }
  
  logging_config {
    include_cookies = false
    bucket          = aws_s3_bucket.logs.bucket_domain_name
    prefix          = "cdn/"
  }
  
  tags = {
    Name        = "PriceX CDN"
    Environment = var.environment
  }
}

resource "aws_cloudfront_origin_access_identity" "main" {
  comment = "PriceX OAI"
}

# ============================================
# S3 BUCKETS - MULTI-REGION REPLICATION
# ============================================

resource "aws_s3_bucket" "frontend" {
  bucket = "pricex-frontend-${var.environment}"
}

resource "aws_s3_bucket_versioning" "frontend" {
  bucket = aws_s3_bucket.frontend.id
  versioning_configuration {
    status = "Enabled"
  }
}

resource "aws_s3_bucket" "logs" {
  bucket = "pricex-logs-${var.environment}"
}

resource "aws_s3_bucket" "backups" {
  provider = aws.us-east-1
  bucket   = "pricex-backups-${var.environment}"
  
  versioning {
    enabled = true
  }
  
  lifecycle_rule {
    id      = "backup-retention"
    enabled = true
    
    transition {
      days          = 30
      storage_class = "STANDARD_IA"
    }
    
    transition {
      days          = 90
      storage_class = "GLACIER"
    }
    
    expiration {
      days = 2555 # 7 years
    }
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = aws_kms_key.backup.arn
      }
    }
  }
}

# Cross-region replication
resource "aws_s3_bucket" "backups_replica" {
  provider = aws.eu-west-1
  bucket   = "pricex-backups-${var.environment}-replica"
  
  versioning {
    enabled = true
  }
  
  server_side_encryption_configuration {
    rule {
      apply_server_side_encryption_by_default {
        sse_algorithm     = "aws:kms"
        kms_master_key_id = aws_kms_key.backup_replica.arn
      }
    }
  }
}

# ============================================
# KMS ENCRYPTION
# ============================================

resource "aws_kms_key" "backup" {
  provider                = aws.us-east-1
  description             = "KMS key for backup encryption"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  
  tags = {
    Name = "PriceX Backup Key"
  }
}

resource "aws_kms_key" "backup_replica" {
  provider                = aws.eu-west-1
  description             = "KMS key for backup encryption (replica)"
  deletion_window_in_days = 30
  enable_key_rotation     = true
  
  tags = {
    Name = "PriceX Backup Key (Replica)"
  }
}

# ============================================
# RDS - GLOBAL DATABASE
# ============================================

resource "aws_rds_global_cluster" "main" {
  provider                  = aws.us-east-1
  global_cluster_identifier = "pricex-global"
  engine                    = "aurora-postgresql"
  engine_version            = "15.4"
  database_name             = "pricex"
  storage_encrypted         = true
}

resource "aws_rds_cluster" "primary" {
  provider                  = aws.us-east-1
  cluster_identifier        = "pricex-primary"
  global_cluster_identifier = aws_rds_global_cluster.main.id
  engine                    = "aurora-postgresql"
  engine_version            = "15.4"
  engine_mode               = "provisioned"
  database_name             = "pricex"
  master_username           = "admin"
  master_password           = var.db_password
  backup_retention_period   = 35
  preferred_backup_window   = "03:00-04:00"
  
  serverlessv2_scaling_configuration {
    max_capacity = 64
    min_capacity = 2
  }
  
  tags = {
    Name = "PriceX Primary DB"
  }
}

resource "aws_rds_cluster_instance" "primary" {
  provider           = aws.us-east-1
  identifier         = "pricex-primary-instance"
  cluster_identifier = aws_rds_cluster.primary.id
  instance_class     = "db.serverless"
  engine             = "aurora-postgresql"
}

resource "aws_rds_cluster" "secondary" {
  provider                  = aws.eu-west-1
  cluster_identifier        = "pricex-secondary"
  global_cluster_identifier = aws_rds_global_cluster.main.id
  engine                    = "aurora-postgresql"
  engine_version            = "15.4"
  
  serverlessv2_scaling_configuration {
    max_capacity = 32
    min_capacity = 1
  }
  
  tags = {
    Name = "PriceX Secondary DB"
  }
}

# ============================================
# ELASTICACHE - GLOBAL CACHE
# ============================================

resource "aws_elasticache_replication_group" "main" {
  provider                 = aws.us-east-1
  replication_group_id     = "pricex-cache"
  description              = "PriceX Redis Cluster"
  engine                   = "redis"
  engine_version           = "7.1"
  node_type                = "cache.r6g.xlarge"
  num_cache_clusters       = 3
  automatic_failover_enabled = true
  multi_az_enabled         = true
  at_rest_encryption_enabled = true
  transit_encryption_enabled = true
  
  tags = {
    Name = "PriceX Cache"
  }
}

# ============================================
# EC2 - BACKEND SERVERS (AUTO SCALING)
# ============================================

resource "aws_launch_template" "backend" {
  provider      = aws.us-east-1
  name_prefix   = "pricex-backend"
  image_id      = "ami-0c55b159cbfafe1f0" # Amazon Linux 2023
  instance_type = "c6i.xlarge"
  
  vpc_security_group_ids = [aws_security_group.backend.id]
  
  user_data = base64encode(templatefile("${path.module}/user-data.sh", {
    environment = var.environment
  }))
  
  tag_specifications {
    resource_type = "instance"
    tags = {
      Name = "PriceX Backend"
    }
  }
}

resource "aws_autoscaling_group" "backend" {
  provider            = aws.us-east-1
  name                = "pricex-backend-asg"
  vpc_zone_identifier = aws_subnet.private[*].id
  target_group_arns   = [aws_lb_target_group.backend.arn]
  health_check_type   = "ELB"
  min_size            = 4
  max_size            = 20
  desired_capacity    = 6
  
  launch_template {
    id      = aws_launch_template.backend.id
    version = "$Latest"
  }
  
  tag {
    key                 = "Name"
    value               = "PriceX Backend"
    propagate_at_launch = true
  }
}

# ============================================
# APPLICATION LOAD BALANCER
# ============================================

resource "aws_lb" "main" {
  provider           = aws.us-east-1
  name               = "pricex-alb"
  internal           = false
  load_balancer_type = "application"
  security_groups    = [aws_security_group.alb.id]
  subnets            = aws_subnet.public[*].id
  
  enable_deletion_protection = true
  enable_cross_zone_load_balancing = true
  
  access_logs {
    bucket  = aws_s3_bucket.logs.bucket
    prefix  = "alb"
    enabled = true
  }
  
  tags = {
    Name = "PriceX ALB"
  }
}

resource "aws_lb_target_group" "backend" {
  provider = aws.us-east-1
  name     = "pricex-backend-tg"
  port     = 8000
  protocol = "HTTP"
  vpc_id   = aws_vpc.main.id
  
  health_check {
    enabled             = true
    healthy_threshold   = 2
    interval            = 30
    matcher             = "200"
    path                = "/health"
    port                = "traffic-port"
    protocol            = "HTTP"
    timeout             = 5
    unhealthy_threshold = 2
  }
}

# ============================================
# SECURITY GROUPS
# ============================================

resource "aws_security_group" "alb" {
  provider    = aws.us-east-1
  name        = "pricex-alb-sg"
  description = "Security group for ALB"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port   = 443
    to_port     = 443
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  ingress {
    from_port   = 80
    to_port     = 80
    protocol    = "tcp"
    cidr_blocks = ["0.0.0.0/0"]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

resource "aws_security_group" "backend" {
  provider    = aws.us-east-1
  name        = "pricex-backend-sg"
  description = "Security group for backend servers"
  vpc_id      = aws_vpc.main.id
  
  ingress {
    from_port       = 8000
    to_port         = 8000
    protocol        = "tcp"
    security_groups = [aws_security_group.alb.id]
  }
  
  egress {
    from_port   = 0
    to_port     = 0
    protocol    = "-1"
    cidr_blocks = ["0.0.0.0/0"]
  }
}

# ============================================
# VPC & NETWORKING
# ============================================

resource "aws_vpc" "main" {
  provider             = aws.us-east-1
  cidr_block           = "10.0.0.0/16"
  enable_dns_hostnames = true
  enable_dns_support   = true
  
  tags = {
    Name = "PriceX VPC"
  }
}

resource "aws_subnet" "public" {
  provider                = aws.us-east-1
  count                   = 3
  vpc_id                  = aws_vpc.main.id
  cidr_block              = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index)
  availability_zone       = data.aws_availability_zones.available.names[count.index]
  map_public_ip_on_launch = true
  
  tags = {
    Name = "PriceX Public Subnet ${count.index + 1}"
    Type = "Public"
  }
}

resource "aws_subnet" "private" {
  provider          = aws.us-east-1
  count             = 3
  vpc_id            = aws_vpc.main.id
  cidr_block        = cidrsubnet(aws_vpc.main.cidr_block, 8, count.index + 10)
  availability_zone = data.aws_availability_zones.available.names[count.index]
  
  tags = {
    Name = "PriceX Private Subnet ${count.index + 1}"
    Type = "Private"
  }
}

resource "aws_internet_gateway" "main" {
  provider = aws.us-east-1
  vpc_id   = aws_vpc.main.id
  
  tags = {
    Name = "PriceX IGW"
  }
}

resource "aws_nat_gateway" "main" {
  provider      = aws.us-east-1
  count         = 3
  allocation_id = aws_eip.nat[count.index].id
  subnet_id     = aws_subnet.public[count.index].id
  
  tags = {
    Name = "PriceX NAT ${count.index + 1}"
  }
}

resource "aws_eip" "nat" {
  provider = aws.us-east-1
  count    = 3
  domain   = "vpc"
  
  tags = {
    Name = "PriceX NAT EIP ${count.index + 1}"
  }
}

data "aws_availability_zones" "available" {
  provider = aws.us-east-1
  state    = "available"
}

# ============================================
# WAF (WEB APPLICATION FIREWALL)
# ============================================

resource "aws_wafv2_web_acl" "main" {
  provider = aws.us-east-1
  name     = "pricex-waf"
  scope    = "CLOUDFRONT"
  
  default_action {
    allow {}
  }
  
  rule {
    name     = "AWSManagedRulesCommonRuleSet"
    priority = 1
    
    override_action {
      none {}
    }
    
    statement {
      managed_rule_group_statement {
        name        = "AWSManagedRulesCommonRuleSet"
        vendor_name = "AWS"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "AWSManagedRulesCommonRuleSetMetric"
      sampled_requests_enabled   = true
    }
  }
  
  rule {
    name     = "RateLimit"
    priority = 2
    
    action {
      block {}
    }
    
    statement {
      rate_based_statement {
        limit              = 2000
        aggregate_key_type = "IP"
      }
    }
    
    visibility_config {
      cloudwatch_metrics_enabled = true
      metric_name                = "RateLimitMetric"
      sampled_requests_enabled   = true
    }
  }
  
  visibility_config {
    cloudwatch_metrics_enabled = true
    metric_name                = "pricex-waf-metric"
    sampled_requests_enabled   = true
  }
}

# ============================================
# DDoS PROTECTION (SHIELD ADVANCED)
# ============================================

resource "aws_shield_protection" "cloudfront" {
  name         = "PriceX CloudFront Protection"
  resource_arn = aws_cloudfront_distribution.main.arn
}

resource "aws_shield_protection" "alb" {
  name         = "PriceX ALB Protection"
  resource_arn = aws_lb.main.arn
}

# ============================================
# OUTPUTS
# ============================================

output "cloudfront_domain" {
  value = aws_cloudfront_distribution.main.domain_name
}

output "alb_dns" {
  value = aws_lb.main.dns_name
}

output "rds_endpoint" {
  value = aws_rds_cluster.primary.endpoint
}

output "s3_bucket" {
  value = aws_s3_bucket.frontend.bucket
}
