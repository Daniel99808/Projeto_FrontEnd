'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Trash2 } from 'lucide-react'
import { useState, useTransition } from 'react'
import { excluirBanner } from '../actions'
import { toast } from 'sonner'

interface DeleteBannerProps {
  banner: {
    id: string
    titulo: string
  }
}

export default function DeleteBanner({ banner }: DeleteBannerProps) {
  const [open, setOpen] = useState(false)
  const [isPending, startTransition] = useTransition()

  async function handleDelete() {
    startTransition(async () => {
      const result = await excluirBanner(banner.id)

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Banner excluído com sucesso!')
        setOpen(false)
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setOpen(true)}
        className="text-red-600 hover:text-red-700"
      >
        <Trash2 className="h-4 w-4" />
      </Button>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Excluir Banner</DialogTitle>
          <DialogDescription>
            Tem certeza que deseja excluir o banner &quot;{banner.titulo}&quot;?
            Esta ação não pode ser desfeita.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <Button
            type="button"
            variant="outline"
            onClick={() => setOpen(false)}
            disabled={isPending}
          >
            Cancelar
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
          >
            {isPending ? 'Excluindo...' : 'Excluir'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
