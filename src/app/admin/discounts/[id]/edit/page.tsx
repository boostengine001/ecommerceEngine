
import { getCoupon, updateCoupon } from "@/lib/actions/coupon.actions";
import CouponForm from "../../coupon-form";
import { notFound } from "next/navigation";

export default async function EditCouponPage({ params }: { params: { id: string } }) {
  const coupon = await getCoupon(params.id);

  if (!coupon) {
    notFound();
  }

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Edit Coupon: {coupon.code}</h2>
          <p className="text-muted-foreground">Update the coupon's details and conditions.</p>
        </div>
      <CouponForm
        action={updateCoupon}
        initialData={coupon}
        buttonLabel="Update Coupon"
        loadingButtonLabel="Updating..."
      />
    </div>
  );
}
