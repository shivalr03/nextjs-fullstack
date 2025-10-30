import { UserButton } from "@stackframe/stack";
import { BarChart3,Plus,Settings,Package } from "lucide-react";
import Link from "next/link";

type SidebarProps = {
  currentPath: string;
};
const navigation = [
  {name:"Dashboard", href:"/dashboard", icon: BarChart3},
  {name:"Inventory", href:"/inventory", icon: Package},
  { name:"Add Product", href:"/add-product", icon: Plus},
  {name:"Settings", href:"/settings", icon: Settings},
];
export default function Sidebar({ currentPath= "/dashboard" }: SidebarProps) {
  return (
    <div className="fixed left-0 top-0 w-64 bg-gray-900 text-white min-h-screen p-6 z-10">
     <div className="mb-8">
        <div className="flex item-center space-x-2 mb-4">
            <BarChart3 className="h-6 w-6" />
            <span className="text-lg font-semibold">Inventory App</span>
        </div>
     </div>
     <nav className="space-y-1">
    <div className="text-sm font-semibold text-gray-400 uppercase">Inventory</div>
    {navigation?.map((item,key) => {
      const IconComponent = item.icon;
     return( <Link
        key={key}
        href={item.href}
        className={`flex items-center p-2 text-sm rounded-md space-x-3 py-2 px-3 rounded-lg ${
          currentPath === item.href ? "bg-purple-100 text-gray-800" : "text-gray-400 hover:bg-gray-800"
        }`}
      >
        <IconComponent className="h-5 w-5 mr-2" />
       <span className="text-sm"> {item.name}</span>
      </Link>
)})}
     </nav>
     <div className="absolute bottom-0 left-0 right-0 p-6 border-t border-gray-700 text-xs text-gray-500">
      <div className="flex item-center justify-between">
        <UserButton showUserInfo/>
      </div>
     </div>
    </div>
  );
}