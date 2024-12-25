// components/OrderDetailsDialog.tsx

import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { formatCurrencyVND } from "@/lib/utils/currencyFormatter";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface OrderDetailsDialogProps {
  isDetailDialogOpen: boolean;
  setDetailDialogOpen: (open: boolean) => void;
  selectedOrder: any; // Modify based on your order structure
  orderDetails: any[]; // Modify based on your order details structure
  productDetails: any; // Modify based on your product details structure
}

const OrderDetailsDialog: React.FC<OrderDetailsDialogProps> = ({
  isDetailDialogOpen,
  setDetailDialogOpen,
  selectedOrder,
  orderDetails,
  productDetails
}) => {
  return (
    <Dialog open={isDetailDialogOpen} onOpenChange={setDetailDialogOpen} modal>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Order Details</DialogTitle>
        </DialogHeader>

        {/* Check if order details exist */}
        {selectedOrder && orderDetails.length > 0 && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="font-bold">Customer Name</TableHead>
                <TableHead className="font-bold">Customer Address</TableHead>
                <TableHead className="font-bold">Customer Phone</TableHead>
                <TableHead className="font-bold">Total Amount</TableHead>
                <TableHead className="font-bold">Created At</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell>{selectedOrder.customerName || "N/A"}</TableCell>
                <TableCell>{selectedOrder.customerAddress || "N/A"}</TableCell>
                <TableCell>{selectedOrder.customerPhone || "N/A"}</TableCell>
                <TableCell>{formatCurrencyVND(selectedOrder.total_amount)}</TableCell>
                <TableCell>{new Date(selectedOrder.createdAt).toLocaleString()}</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        )}

        <h4><strong>Product Information:</strong></h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="font-bold">Title</TableHead>
              <TableHead className="font-bold">Author</TableHead>
              <TableHead className="font-bold">Price</TableHead>
              <TableHead className="font-bold">Quantity</TableHead>
              <TableHead className="font-bold">Total</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orderDetails.map((orderDetail) => (
              <TableRow key={orderDetail.id}>
                {productDetails[orderDetail.productId] ? (
                  <>
                    <TableCell>{productDetails[orderDetail.productId].title}</TableCell>
                    <TableCell>{productDetails[orderDetail.productId].author}</TableCell>
                    <TableCell>{formatCurrencyVND(productDetails[orderDetail.productId].price)}</TableCell>
                    <TableCell>{orderDetail.num}</TableCell>
                    <TableCell className="text-red-600">
                      {formatCurrencyVND(productDetails[orderDetail.productId].price * orderDetail.num)}
                    </TableCell>
                  </>
                ) : (
                  <TableCell colSpan={5}>Loading product details...</TableCell>
                )}
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <DialogFooter>
          <Button variant="secondary" onClick={() => setDetailDialogOpen(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsDialog;
