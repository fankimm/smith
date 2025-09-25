'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'

interface CustomAreaFormProps {
  onAdd: (name: string) => void
  isOpen: boolean
  onClose: () => void
}

export default function CustomAreaForm({ onAdd, isOpen, onClose }: CustomAreaFormProps) {
  const [areaName, setAreaName] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!areaName.trim()) return

    onAdd(areaName.trim())
    setAreaName('')
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold tracking-tight">
            커스텀 사냥터 추가
          </DialogTitle>
          <p className="text-sm text-muted-foreground">
            새로운 사냥터를 추가하여 런을 추적하세요
          </p>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-3">
            <Label htmlFor="areaName" className="text-sm font-medium leading-none">
              사냥터 이름
            </Label>
            <Input
              id="areaName"
              value={areaName}
              onChange={(e) => setAreaName(e.target.value)}
              placeholder="예: 니힐라택, 트라빈칼 등..."
              autoFocus
              className="h-9"
            />
          </div>

          <div className="flex gap-2 pt-2">
            <Button
              type="submit"
              disabled={!areaName.trim()}
              className="flex-1 h-9 bg-primary text-primary-foreground hover:bg-primary/90"
            >
              추가
            </Button>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1 h-9"
            >
              취소
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}