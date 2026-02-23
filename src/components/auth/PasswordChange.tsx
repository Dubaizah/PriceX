'use client';

import { useState } from 'react';
import { Lock, AlertTriangle, Check, X, Clock, History } from 'lucide-react';

interface PasswordRequirements {
  minLength: number;
  maxLength: number;
  minUppercase: number;
  minNumbers: number;
  minSymbols: number;
  historyCount: number;
  expiryDays: number;
}

interface PasswordChangeProps {
  onChange: (currentPassword: string, newPassword: string) => Promise<{ success: boolean; error?: string }>;
  requirements?: PasswordRequirements;
}

export function PasswordChange({ onChange, requirements }: PasswordChangeProps) {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPasswords, setShowPasswords] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const req = requirements || {
    minLength: 8,
    maxLength: 32,
    minUppercase: 1,
    minNumbers: 1,
    minSymbols: 1,
    historyCount: 5,
    expiryDays: 90,
  };

  const checks = [
    { met: newPassword.length >= req.minLength && newPassword.length <= req.maxLength, text: `${req.minLength}-${req.maxLength} characters` },
    { met: (newPassword.match(/[A-Z]/g) || []).length >= req.minUppercase, text: 'At least 1 uppercase letter' },
    { met: (newPassword.match(/[0-9]/g) || []).length >= req.minNumbers, text: 'At least 1 number' },
    { met: (newPassword.match(/[!@#$%^&*]/g) || []).length >= req.minSymbols, text: 'At least 1 special character' },
    { met: newPassword === confirmPassword && newPassword.length > 0, text: 'Passwords match' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('Please fill in all fields');
      return;
    }

    if (!checks.every(c => c.met)) {
      setError('Password does not meet requirements');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password must be different from current password');
      return;
    }

    setIsLoading(true);
    const result = await onChange(currentPassword, newPassword);
    setIsLoading(false);

    if (result.success) {
      setSuccess('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } else {
      setError(result.error || 'Failed to change password');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-2">Current Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPasswords ? 'text' : 'password'}
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
            required
          />
          <button
            type="button"
            onClick={() => setShowPasswords(!showPasswords)}
            className="absolute right-3 top-1/2 -translate-y-1/2"
          >
            {showPasswords ? <X className="w-5 h-5 text-muted-foreground" /> : <Check className="w-5 h-5 text-muted-foreground" />}
          </button>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPasswords ? 'text' : 'password'}
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="w-full h-12 pl-12 pr-12 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
            required
          />
        </div>
        <div className="mt-2 space-y-1">
          {checks.map((check, i) => (
            <div key={i} className="flex items-center gap-2 text-xs">
              <div className={`w-3 h-3 rounded-full flex items-center justify-center ${check.met ? 'bg-green-500' : 'bg-gray-300'}`}>
                {check.met && <Check className="w-2 h-2 text-white" />}
              </div>
              <span className={check.met ? 'text-green-500' : 'text-muted-foreground'}>{check.text}</span>
            </div>
          ))}
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium mb-2">Confirm New Password</label>
        <div className="relative">
          <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
          <input
            type={showPasswords ? 'text' : 'password'}
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="w-full h-12 pl-12 rounded-xl bg-secondary border border-border focus:border-[var(--pricex-yellow)] outline-none"
            required
          />
        </div>
      </div>

      <div className="flex items-center gap-2 p-3 rounded-xl bg-blue-500/10 border border-blue-500/30 text-sm text-blue-500">
        <Clock className="w-4 h-4" />
        <span>Password must be changed every {req.expiryDays} days</span>
      </div>

      {error && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-red-500/10 text-red-500 text-sm">
          <AlertTriangle className="w-4 h-4" />
          {error}
        </div>
      )}

      {success && (
        <div className="flex items-center gap-2 p-3 rounded-xl bg-green-500/10 text-green-500 text-sm">
          <Check className="w-4 h-4" />
          {success}
        </div>
      )}

      <button
        type="submit"
        disabled={isLoading || !checks.every(c => c.met)}
        className="w-full h-12 bg-[var(--pricex-yellow)] text-black font-semibold rounded-xl hover:bg-[var(--pricex-yellow-dark)] transition-colors disabled:opacity-50"
      >
        {isLoading ? 'Changing...' : 'Change Password'}
      </button>
    </form>
  );
}
