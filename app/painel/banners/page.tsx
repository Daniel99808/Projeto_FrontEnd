import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import prisma from '@/lib/prisma-client'
import AddBanner from './_components/add-banner'
import DeleteBanner from './_components/delete-banner'
import { Badge } from '@/components/ui/badge'
import Image from 'next/image'

export default async function BannersPage() {
  const banners = await prisma.banner.findMany({
    orderBy: {
      ordem: 'asc'
    }
  })

  return (
    <div className="space-y-6">
      <div className='flex items-center justify-between'>
        <h1 className='text-2xl font-semibold'>Banners</h1>
        <AddBanner />
      </div>

      {banners.length === 0 ? (
        <div className='flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground'>
          <p>Nenhum banner cadastrado</p>
          <p className="text-sm">Clique em &quot;Adicionar Banner&quot; para criar seu primeiro banner.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {banners.map((banner) => (
            <Card key={banner.id} className="overflow-hidden">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="line-clamp-1 text-lg">{banner.titulo}</CardTitle>
                  <Badge variant={banner.ativo ? 'default' : 'secondary'}>
                    {banner.ativo ? 'Ativo' : 'Inativo'}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="pb-3 space-y-2">
                <div className="relative h-40 w-full rounded border overflow-hidden bg-gray-50">
                  <Image
                    src={banner.imageUrl}
                    alt={banner.titulo}
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
                {banner.subtitulo && (
                  <p className="text-sm text-muted-foreground">{banner.subtitulo}</p>
                )}
                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                  <span>Ordem: {banner.ordem}</span>
                  {banner.link && (
                    <span className="truncate">Link: {banner.link}</span>
                  )}
                </div>
              </CardContent>
              <CardFooter className='flex items-center justify-end gap-2'>
                <DeleteBanner banner={banner} />
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
