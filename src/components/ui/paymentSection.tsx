import { createAxiosInstance } from "@/app/utils/axiosInstance"
import {Button} from "./button"
import { useAuthStore } from "@/stores/authStore"
interface PaymentSectionProps {
  plan: string
  price: number
}

const PaymentSection: React.FC<PaymentSectionProps> = ({plan, price}) => {
    const api = createAxiosInstance()
    const {user} = useAuthStore()
  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl font-bold mb-4">Payment for {plan} Plan</h2>
      <p className="text-xl mb-8">Price: ${price} USD/year</p>
      <div className="w-full max-w-md">
        {/* Add your payment form here */}
        <Button className="w-full bg-blue-500 hover:bg-blue-600">
          Proceed to Payment
        </Button>
      </div>
    </div>
  )
}

export default PaymentSection
