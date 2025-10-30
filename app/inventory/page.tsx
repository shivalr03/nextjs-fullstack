import Sidebar from "@/components/sidebar";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/auth";
import { deleteProduct } from "@/lib/actions/product"; 
import Pagination from "@/components/pagination";

export default async function InventoryPage({searchParams}:{searchParams: Promise<{q?:string,page?:string}>}) {
      const user = await getCurrentUser();
      const userId = user.id;
      const params = await searchParams;
      const q = (params.q ?? "").trim();
        const pageSize = 5;
      
      const where ={
        userId, 
        ...(q ? { name: { contains: q, mode: "insensitive" as const } } : {})
      }
  const page = Math.max(1,Number(params.page || "1"));
     const [totalCount,items] = await Promise.all([
    prisma.product.count({where}),
    prisma.product.findMany({where,
        orderBy: { createdAt: "desc" },
        skip:(page -1)* pageSize,
        take:pageSize,
    })
  ]); 
  console.log('items',items);

  const totalPages=Math.max(1,Math.ceil(totalCount/pageSize));
  
    return (
    <div className="min-h-screen bg-gray-50">
        <Sidebar currentPath="/inventory" />
        <main className="ml-64 p-8">
            <div className="mb-8">
                <div className= "flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
                        <p className="text-sm text-gray-500">Manage your product inventory here.</p>
                    </div>
                </div>
            </div>
            <div className="space-y-6">
                <div className="bg-white rounded-lg border border-gray-200 p-6">
                   <form className="flex gap-2" action={"/inventory"} method="GET">
                    <input name="q" placeholder="Search Products..." className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500" />
                    <button type="submit" className="bg-purple-600 text-white px-4 py-2 rounded-md hover:bg-purple-700">Search</button>
                   </form> 
                </div>
                {/* Inventory management Table */}
                <div className="bg-white shadow rounded-lg p-6 border-gray-200 overflow-hidden">
                <table className="w-full">
                    <thead className="bg-gray-50">
                        <tr>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">Name</th>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">SKU</th>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">Price</th>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">Quantity</th>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">Low Stock At</th>
                            <th className="px-6 text-left text-xs font-medium text-gray-500 uppercase py-3">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                        {
                            items?.map((product,key)=>(
                                <tr key={key}>
                                    <td className="px-6 py-4  text-sm text-gray-500">{product.name}</td>
                                    <td className="px-6 py-4  text-sm text-gray-500">{product.sku || "-"}</td>
                                    <td className="px-6 py-4  text-sm text-gray-500">₹{Number(product.price).toFixed(2)}</td>
                                    <td className="px-6 py-4  text-sm text-gray-500">{product.quantity || "-"}</td>
                                    <td className="px-6 py-4  text-sm text-gray-500">{product.lowStockAt || "-"}</td>
                                    <td className="px-6 py-4  text-sm text-gray-500">
                                        <form action={async(formData:FormData)=>{
                                            "use server";
                                            await deleteProduct(formData);
                                        }}>
                                            <input type="hidden" name="id" value={product.id} />
                                        <button className="text-red-600 hover:text-red-900  hover:cursor-pointer">Delete</button>
                                        </form>
                                    </td>
                                </tr>
                            ))
                        }
                    </tbody>
                </table>
                </div>
                {totalPages > 1 && (
                    <div className="flex justify-center space-x-2 mt-4">
                        <Pagination currentPage={page} totalPages={totalPages} baseUrl="/inventory" searchParams={{q, pageSize: String(pageSize)}} />
                        </div>
                )
                        }
            </div>
        </main>
    </div>
  );
}