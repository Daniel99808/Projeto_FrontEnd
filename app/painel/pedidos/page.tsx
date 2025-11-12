import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import prisma from '@/lib/prisma-client'
import AddPedidos from './_components/add-pedidos'
import EditPedido from './_components/edit-pedidos'
import DeletePedido from './_components/delete-pedidos'

export default async function PedidosPage() {
  const [pedidos, produtos] = await Promise.all([
    prisma.pedidos.findMany({
      include: {
        items: {
          include: {
            produto: true,
          },
        },
      },
      orderBy: {
        criadoEm: 'desc',
      },
    }),
    prisma.produtos.findMany({
      orderBy: {
        nome: 'asc',
      },
    }),
  ])

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Pedidos</h1>
        <AddPedidos produtos={produtos} />
      </div>

      {pedidos.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-2 rounded-md border border-dashed p-8 text-center text-muted-foreground">
          <p>Nenhum pedido cadastrado</p>
          <p className="text-sm">Clique em "Novo Pedido" para criar seu primeiro pedido.</p>
        </div>
      ) : (
        <div className="rounded-md border">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Cliente</TableHead>
                <TableHead>Endereço</TableHead>
                <TableHead>Telefone</TableHead>
                <TableHead>Produtos</TableHead>
                <TableHead className="text-right">Total</TableHead>
                <TableHead className="text-right">Ações</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {pedidos.map((pedido) => {
                const total = pedido.items.reduce(
                  (sum, item) => sum + item.precoUnit * item.quantidade,
                  0
                )

                return (
                  <TableRow key={pedido.id}>
                    <TableCell className="font-medium">{pedido.nomeCliente}</TableCell>
                    <TableCell>{pedido.endereco}</TableCell>
                    <TableCell>{pedido.telefone}</TableCell>
                    <TableCell>
                      <div className="flex flex-col gap-1">
                        {pedido.items.map((item) => (
                          <span key={item.id} className="text-sm">
                            {item.quantidade}x {item.produto.nome}
                          </span>
                        ))}
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-semibold">
                      R$ {total.toFixed(2)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-2">
                        <EditPedido
                          pedido={{
                            id: pedido.id,
                            nomeCliente: pedido.nomeCliente,
                            endereco: pedido.endereco,
                            telefone: pedido.telefone,
                            items: pedido.items.map((item) => ({
                              produtoId: item.produtoId,
                              quantidade: item.quantidade,
                            })),
                          }}
                          produtos={produtos}
                        />
                        <DeletePedido
                          pedido={{
                            id: pedido.id,
                            nomeCliente: pedido.nomeCliente,
                          }}
                        />
                      </div>
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </div>
      )}
    </div>
  )
}
