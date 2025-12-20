'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { createClient } from '@/lib/supabase/client'
import { toast } from 'sonner'
import { Plus } from 'lucide-react'
import { Calendar24 } from '@/components/ui/calendar24'

interface CreateCouponDialogProps {
  onSuccess?: () => void
  trigger?: React.ReactNode
}

export function CreateCouponDialog({ onSuccess, trigger }: CreateCouponDialogProps) {
  const [open, setOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(undefined)
  const [selectedTime, setSelectedTime] = useState('10:30:00')
  const [formData, setFormData] = useState({
    code: '',
    discount_type: 'percentage',
    discount_value: '',
    usage_limit: '',
    is_active: true,
  })

  const supabase = createClient()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.code || !formData.discount_value) {
      toast.error('Please fill in all required fields')
      return
    }

    if (parseFloat(formData.discount_value) <= 0) {
      toast.error('Discount value must be greater than 0')
      return
    }

    if (formData.discount_type === 'percentage' && parseFloat(formData.discount_value) > 100) {
      toast.error('Percentage discount cannot exceed 100%')
      return
    }

    setIsLoading(true)

    try {
      const couponData = {
        code: formData.code.toUpperCase().trim(),
        discount_type: formData.discount_type,
        discount_value: parseFloat(formData.discount_value),
        usage_limit: formData.usage_limit ? parseInt(formData.usage_limit) : null,
        usage_count: 0,
        is_active: formData.is_active,
        expires_at: selectedDate && selectedTime ? 
          new Date(`${selectedDate.toISOString().split('T')[0]}T${selectedTime}`).toISOString() : 
          null,
      }

      const { error } = await supabase
        .from('coupons')
        .insert([couponData])

      if (error) {
        if (error.code === '23505') {
          toast.error('A coupon with this code already exists')
        } else {
          throw error
        }
        return
      }

      toast.success('Coupon created successfully!')
      setOpen(false)
      setFormData({
        code: '',
        discount_type: 'percentage',
        discount_value: '',
        usage_limit: '',
        is_active: true,
      })
      setSelectedDate(undefined)
      setSelectedTime('10:30:00')
      onSuccess?.()
    } catch (error) {
      console.error('Error creating coupon:', error)
      toast.error('Failed to create coupon')
    } finally {
      setIsLoading(false)
    }
  }

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let result = ''
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length))
    }
    setFormData(prev => ({ ...prev, code: result }))
  }

  const defaultTrigger = (
    <Button className="bg-red-600 hover:bg-red-700 text-white shadow-lg shadow-red-600/25">
      <Plus className="mr-2 h-4 w-4" />
      Create Coupon
    </Button>
  )

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || defaultTrigger}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create New Coupon</DialogTitle>
          <DialogDescription>
            Create a new discount coupon for your customers
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="code">Coupon Code *</Label>
            <div className="flex space-x-2">
              <Input
                id="code"
                placeholder="e.g., SAVE20"
                value={formData.code}
                onChange={(e) => setFormData(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                className="flex-1"
                maxLength={20}
              />
              <Button
                type="button"
                variant="outline"
                onClick={generateRandomCode}
                className="px-3"
              >
                Generate
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="discount_type">Discount Type *</Label>
              <Select
                value={formData.discount_type}
                onValueChange={(value) => setFormData(prev => ({ ...prev, discount_type: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="percentage">Percentage (%)</SelectItem>
                  <SelectItem value="fixed">Fixed Amount (₹)</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="discount_value">
                Discount Value * {formData.discount_type === 'percentage' ? '(%)' : '(₹)'}
              </Label>
              <Input
                id="discount_value"
                type="number"
                placeholder={formData.discount_type === 'percentage' ? '10' : '100'}
                value={formData.discount_value}
                onChange={(e) => setFormData(prev => ({ ...prev, discount_value: e.target.value }))}
                min="0"
                max={formData.discount_type === 'percentage' ? '100' : undefined}
                step={formData.discount_type === 'percentage' ? '0.1' : '1'}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="usage_limit">Usage Limit (optional)</Label>
            <Input
              id="usage_limit"
              type="number"
              placeholder="Leave empty for unlimited"
              value={formData.usage_limit}
              onChange={(e) => setFormData(prev => ({ ...prev, usage_limit: e.target.value }))}
              min="1"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="expires_at">Expiry Date & Time (optional)</Label>
            <Calendar24 
              date={selectedDate}
              onDateChange={setSelectedDate}
              time={selectedTime}
              onTimeChange={setSelectedTime}
            />
            <p className="text-xs text-muted-foreground">
              Leave empty for no expiry date
            </p>
          </div>

          <div className="flex items-center space-x-2">
            <Switch
              id="is_active"
              checked={formData.is_active}
              onCheckedChange={(checked) => setFormData(prev => ({ ...prev, is_active: checked }))}
            />
            <Label htmlFor="is_active">Active immediately</Label>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-red-600 hover:bg-red-700"
            >
              {isLoading ? 'Creating...' : 'Create Coupon'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}