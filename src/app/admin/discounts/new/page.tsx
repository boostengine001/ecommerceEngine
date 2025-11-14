
import { addCoupon } from '@/lib/actions/coupon.actions';
import CouponForm from '../coupon-form';

export default function NewCouponPage() {

  return (
    <div className="space-y-6">
       <div>
          <h2 className="text-3xl font-bold tracking-tight">Create New Coupon</h2>
          <p className="text-muted-foreground">Fill in the details to create a new discount code.</p>
        </div>
      <CouponForm
        action={addCoupon} 
        buttonLabel="Create Coupon"
        loadingButtonLabel="Creating..."
      />
    </div>
  );
}
