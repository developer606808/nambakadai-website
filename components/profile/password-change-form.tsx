"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2, Eye, EyeOff, X } from "lucide-react"

interface PasswordFormData {
  currentPassword: string
  newPassword: string
  confirmPassword: string
}

interface PasswordStrength {
  score: number
  feedback: string[]
}

interface PasswordChangeFormProps {
  formData: PasswordFormData
  onFormChange: (field: keyof PasswordFormData, value: string) => void
  showPasswords: {
    current: boolean
    new: boolean
    confirm: boolean
  }
  onTogglePasswordVisibility: (field: 'current' | 'new' | 'confirm') => void
  passwordStrength: PasswordStrength
  onSubmit: () => void
  changing: boolean
}

export function PasswordChangeForm({
  formData,
  onFormChange,
  showPasswords,
  onTogglePasswordVisibility,
  passwordStrength,
  onSubmit,
  changing,
}: PasswordChangeFormProps) {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 sm:p-6 shadow-sm hover:shadow-md transition-all duration-300">
      <div className="flex items-center space-x-3 mb-6">
        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
          <svg className="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-gray-900">Change Password</h2>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <Label htmlFor="currentPassword" className="text-sm font-medium text-gray-700 flex items-center">
            <span>Current Password</span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="currentPassword"
              type={showPasswords.current ? "text" : "password"}
              value={formData.currentPassword}
              onChange={(e) => onFormChange('currentPassword', e.target.value)}
              placeholder="Enter your current password"
              className="h-12 text-base pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => onTogglePasswordVisibility('current')}
            >
              {showPasswords.current ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="newPassword" className="text-sm font-medium text-gray-700 flex items-center">
            <span>New Password</span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="newPassword"
              type={showPasswords.new ? "text" : "password"}
              value={formData.newPassword}
              onChange={(e) => onFormChange('newPassword', e.target.value)}
              placeholder="Enter your new password"
              className="h-12 text-base pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => onTogglePasswordVisibility('new')}
            >
              {showPasswords.new ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </div>

          {/* Password Strength Indicator */}
          {formData.newPassword && (
            <div className="mt-3 p-4 bg-gray-50 rounded-lg border border-gray-200 animate-in slide-in-from-top-2 duration-300">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-sm font-medium text-gray-700">Password strength:</span>
                <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
                  <div
                    className={`h-3 rounded-full transition-all duration-500 ease-out ${
                      passwordStrength.score <= 2 ? 'bg-gradient-to-r from-red-400 to-red-500' :
                      passwordStrength.score <= 4 ? 'bg-gradient-to-r from-yellow-400 to-yellow-500' :
                      'bg-gradient-to-r from-green-400 to-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 6) * 100}%` }}
                  />
                </div>
                <span className={`text-sm font-semibold px-2 py-1 rounded-full ${
                  passwordStrength.score <= 2 ? 'text-red-700 bg-red-100' :
                  passwordStrength.score <= 4 ? 'text-yellow-700 bg-yellow-100' :
                  'text-green-700 bg-green-100'
                }`}>
                  {passwordStrength.score <= 2 ? 'Weak' :
                   passwordStrength.score <= 4 ? 'Medium' : 'Strong'}
                </span>
              </div>
              {passwordStrength.feedback.length > 0 && (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Suggestions:</p>
                  <ul className="space-y-1">
                    {passwordStrength.feedback.map((feedback, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm text-gray-600">
                        <X className="w-4 h-4 text-red-500 mt-0.5 flex-shrink-0" />
                        <span>{feedback}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-700 flex items-center">
            <span>Confirm New Password</span>
            <span className="text-red-500 ml-1">*</span>
          </Label>
          <div className="relative">
            <Input
              id="confirmPassword"
              type={showPasswords.confirm ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => onFormChange('confirmPassword', e.target.value)}
              placeholder="Confirm your new password"
              className="h-12 text-base pr-12 transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-gray-50 transition-colors duration-200"
              onClick={() => onTogglePasswordVisibility('confirm')}
            >
              {showPasswords.confirm ? (
                <EyeOff className="h-5 w-5 text-gray-500" />
              ) : (
                <Eye className="h-5 w-5 text-gray-500" />
              )}
            </Button>
          </div>
        </div>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row sm:justify-end gap-3">
        <Button
          onClick={onSubmit}
          disabled={changing}
          className="h-12 px-8 bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white font-medium rounded-lg shadow-md hover:shadow-lg transition-all duration-300 hover:scale-105 disabled:hover:scale-100"
        >
          {changing ? (
            <div className="flex items-center space-x-2">
              <Loader2 className="h-5 w-5 animate-spin" />
              <span>Changing Password...</span>
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
              <span>Change Password</span>
            </div>
          )}
        </Button>
      </div>
    </div>
  )
}