import UserOrders from "@/components/features/userOrders";

interface userOrderssProps {
  params: { userId: string };
}

export default function OrdersPage({ params }: userOrderssProps) {
    console.log("userId",params.userId)
  return <UserOrders userId={params.userId} />;
}
