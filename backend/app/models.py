# PriceX Backend Database Models
# SQLAlchemy models for PostgreSQL

from sqlalchemy import create_engine, Column, String, Float, DateTime, Boolean, Text, Integer, ForeignKey, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import sessionmaker, relationship
from datetime import datetime
from typing import Optional

Base = declarative_base()

class User(Base):
    __tablename__ = "users"
    
    id = Column(String(36), primary_key=True)
    email = Column(String(255), unique=True, nullable=False, index=True)
    name = Column(String(255), nullable=False)
    password_hash = Column(String(255), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    is_verified = Column(Boolean, default=False)
    loyalty_points = Column(Integer, default=0)
    loyalty_tier = Column(String(20), default="bronze")
    referral_code = Column(String(20), unique=True)
    referred_by = Column(String(36), ForeignKey("users.id"), nullable=True)
    
    # Relationships
    saved_products = relationship("SavedProduct", back_populates="user")
    price_alerts = relationship("PriceAlert", back_populates="user")

class Product(Base):
    __tablename__ = "products"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(500), nullable=False, index=True)
    description = Column(Text)
    brand = Column(String(100), index=True)
    category = Column(String(100), index=True)
    upc = Column(String(13), unique=True, nullable=True)
    ean = Column(String(13), unique=True, nullable=True)
    mpn = Column(String(50), nullable=True)
    images = Column(JSON, default=list)
    specifications = Column(JSON, default=dict)
    rating = Column(Float, default=0.0)
    review_count = Column(Integer, default=0)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    is_active = Column(Boolean, default=True)
    
    # Relationships
    prices = relationship("Price", back_populates="product")
    saved_by = relationship("SavedProduct", back_populates="product")

class Retailer(Base):
    __tablename__ = "retailers"
    
    id = Column(String(36), primary_key=True)
    name = Column(String(100), nullable=False)
    domain = Column(String(255), nullable=False)
    logo_url = Column(String(500))
    is_active = Column(Boolean, default=True)
    affiliate_id = Column(String(100))
    api_key = Column(String(255))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    prices = relationship("Price", back_populates="retailer")

class Price(Base):
    __tablename__ = "prices"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    retailer_id = Column(String(36), ForeignKey("retailers.id"), nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    url = Column(String(1000), nullable=False)
    in_stock = Column(Boolean, default=True)
    shipping_cost = Column(Float, default=0.0)
    last_updated = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    product = relationship("Product", back_populates="prices")
    retailer = relationship("Retailer", back_populates="prices")

class PriceHistory(Base):
    __tablename__ = "price_history"
    
    id = Column(String(36), primary_key=True)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    retailer_id = Column(String(36), ForeignKey("retailers.id"), nullable=False)
    price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    recorded_at = Column(DateTime, default=datetime.utcnow)
    
    # Indexes for time-series queries
    __table_args__ = (
        Index('idx_price_history_product_time', 'product_id', 'recorded_at'),
    )

class SavedProduct(Base):
    __tablename__ = "saved_products"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Relationships
    user = relationship("User", back_populates="saved_products")
    product = relationship("Product", back_populates="saved_by")

class PriceAlert(Base):
    __tablename__ = "price_alerts"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    product_id = Column(String(36), ForeignKey("products.id"), nullable=False)
    target_price = Column(Float, nullable=False)
    currency = Column(String(3), default="USD")
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    triggered_at = Column(DateTime, nullable=True)
    
    # Relationships
    user = relationship("User", back_populates="price_alerts")

class SearchQuery(Base):
    __tablename__ = "search_queries"
    
    id = Column(String(36), primary_key=True)
    query = Column(String(500), nullable=False, index=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    region = Column(String(50))
    results_count = Column(Integer)
    created_at = Column(DateTime, default=datetime.utcnow)

class AuditLog(Base):
    __tablename__ = "audit_logs"
    
    id = Column(String(36), primary_key=True)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    action = Column(String(100), nullable=False)
    entity_type = Column(String(50), nullable=False)
    entity_id = Column(String(36))
    details = Column(JSON)
    ip_address = Column(String(45))
    user_agent = Column(String(500))
    created_at = Column(DateTime, default=datetime.utcnow)
    
    # Indexes
    __table_args__ = (
        Index('idx_audit_user_time', 'user_id', 'created_at'),
        Index('idx_audit_action', 'action'),
    )

# Database connection
from sqlalchemy import Index

def get_db_url() -> str:
    """Get database URL from environment"""
    import os
    return os.getenv(
        "DATABASE_URL",
        "postgresql://pricex:pricex@localhost:5432/pricex"
    )

def create_tables():
    """Create all tables"""
    engine = create_engine(get_db_url())
    Base.metadata.create_all(bind=engine)

def get_session():
    """Get database session"""
    engine = create_engine(get_db_url())
    SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
    return SessionLocal()
