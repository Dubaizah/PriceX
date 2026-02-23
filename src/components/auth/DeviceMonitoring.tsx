'use client';

import { useState, useEffect } from 'react';
import { Monitor, Smartphone, Tablet, Globe, Clock, MapPin, Shield, AlertTriangle } from 'lucide-react';

interface DeviceInfo {
  type: 'desktop' | 'mobile' | 'tablet';
  browser: string;
  os: string;
  ip: string;
  location: string;
  lastActive: string;
}

export function DeviceMonitoring() {
  const [device, setDevice] = useState<DeviceInfo | null>(null);
  const [recentDevices, setRecentDevices] = useState<DeviceInfo[]>([]);

  useEffect(() => {
    const detectDevice = () => {
      const ua = navigator.userAgent;
      let deviceType: 'desktop' | 'mobile' | 'tablet' = 'desktop';
      if (/mobile/i.test(ua)) deviceType = 'mobile';
      else if (/tablet/i.test(ua)) deviceType = 'tablet';

      const browsers = ['Chrome', 'Firefox', 'Safari', 'Edge', 'Opera'];
      let browser = 'Unknown';
      for (const b of browsers) {
        if (ua.includes(b)) {
          browser = b;
          break;
        }
      }

      const osList = ['Windows', 'Mac', 'Linux', 'Android', 'iOS'];
      let os = 'Unknown';
      for (const o of osList) {
        if (ua.includes(o)) {
          os = o;
          break;
        }
      }

      return {
        type: deviceType,
        browser,
        os: `${os} ${ua.match(/\(([^)]+)\)/)?.[1] || ''}`,
        ip: 'Detecting...',
        location: 'Detecting...',
        lastActive: 'Now',
      };
    };

    setDevice(detectDevice());

    // Simulated recent devices
    setRecentDevices([
      { type: 'desktop', browser: 'Chrome', os: 'Windows 11', ip: '192.168.1.xxx', location: 'Dubai, UAE', lastActive: 'Now' },
      { type: 'mobile', browser: 'Safari', os: 'iOS 17', ip: '192.168.1.xxx', location: 'Dubai, UAE', lastActive: '2 hours ago' },
    ]);
  }, []);

  const getDeviceIcon = (type: string) => {
    switch (type) {
      case 'mobile': return Smartphone;
      case 'tablet': return Tablet;
      default: return Monitor;
    }
  };

  return (
    <div className="space-y-4">
      <h3 className="font-medium flex items-center gap-2">
        <Monitor className="w-5 h-5" />
        Device & Security Monitoring
      </h3>

      {/* Current Device */}
      {device && (
        <div className="p-4 rounded-xl bg-green-500/10 border border-green-500/30">
          <div className="flex items-center gap-3 mb-3">
            {(() => {
              const Icon = getDeviceIcon(device.type);
              return <Icon className="w-6 h-6 text-green-500" />;
            })()}
            <div>
              <p className="font-medium">Current Session</p>
              <p className="text-sm text-muted-foreground">{device.browser} on {device.os}</p>
            </div>
            <span className="ml-auto px-3 py-1 rounded-full text-xs bg-green-500/20 text-green-500">
              Active
            </span>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="flex items-center gap-2 text-muted-foreground">
              <Globe className="w-4 h-4" />
              <span>IP: {device.ip}</span>
            </div>
            <div className="flex items-center gap-2 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{device.location}</span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Devices */}
      <div>
        <h4 className="text-sm font-medium mb-2">Recent Activity</h4>
        <div className="space-y-2">
          {recentDevices.map((d, i) => {
            const Icon = getDeviceIcon(d.type);
            return (
              <div key={i} className="flex items-center gap-3 p-3 rounded-xl bg-secondary/50">
                <Icon className="w-5 h-5 text-muted-foreground" />
                <div className="flex-1">
                  <p className="text-sm font-medium">{d.browser} on {d.os}</p>
                  <p className="text-xs text-muted-foreground">{d.location} • {d.lastActive}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Security Alerts */}
      <div className="p-4 rounded-xl bg-yellow-500/10 border border-yellow-500/30">
        <div className="flex items-center gap-2 text-yellow-500 mb-2">
          <Shield className="w-5 h-5" />
          <span className="font-medium">Security Status</span>
        </div>
        <p className="text-sm text-muted-foreground">
          Your account is protected with 2FA. Last password change: 30 days ago.
        </p>
      </div>
    </div>
  );
}
