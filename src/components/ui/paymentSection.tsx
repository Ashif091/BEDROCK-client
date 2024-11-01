import { useEffect, useState } from 'react'
import { createAxiosInstance } from "@/app/utils/axiosInstance"
import { Button } from "./button"
import { useAuthStore } from "@/stores/authStore"
import { Elements, PaymentElement, useStripe, useElements } from '@stripe/react-stripe-js'
import stripePromise from '@/app/utils/stripe'
import { useRouter } from 'next/navigation'
import { format } from 'date-fns'
import { Loader2 } from 'lucide-react'
interface PaymentSectionProps {
  plan: string
  price: number
}
interface PaymentConfirmationProps {
    paymentInfo: any
    userDta: any
  }
  
  const PaymentConfirmation: React.FC<PaymentConfirmationProps> = ({ paymentInfo, userDta }) => {
    return (
      <div className="bg-white text-gray-800 p-8 rounded-lg shadow-lg max-w-md w-full">
        <h2 className="text-2xl font-bold mb-4 text-center text-green-600">Payment Successful!</h2>
        <div className="border-t border-b border-gray-200 py-4 mb-4">
          <p className="font-semibold">Amount Paid: ${paymentInfo.amount / 100} USD</p>
          <p>Plan: {userDta.subscription.plan}</p>
          <p>Payment ID: {paymentInfo.id}</p>
          <p>Date: {format(new Date(paymentInfo.created * 1000), 'MMMM dd, yyyy HH:mm:ss')}</p>
        </div>
        <div className="mb-4">
          <h3 className="font-semibold mb-2">Customer Details:</h3>
          <p>Name: {userDta.fullname}</p>
          <p>Email: {userDta.email}</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Subscription Details:</h3>
          <p>Status: {userDta.subscription.status ? 'Active' : 'Inactive'}</p>
          <p>Expiration Date: {format(new Date(userDta.subscription.exp_date), 'MMMM dd, yyyy')}</p>
        </div>
        <div className="mt-6 text-center">
          <p className="text-sm text-gray-600">Thank you for your purchase!</p>
        </div>
      </div>
    )
  }

const CheckoutForm: React.FC<{ price: number,plan:string }> = ({ price,plan }) => {
  const stripe = useStripe()
  const elements = useElements()
  const [error, setError] = useState<string | null>(null)
  const [processing, setProcessing] = useState(false)
  const [paymentStatus, setpaymentStatus] = useState(false)
  const [confirmationData, setConfirmationData] = useState<any>(null)

  const api = createAxiosInstance()
  const router = useRouter()
  const { setUser} = useAuthStore()

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault()

    if (!stripe || !elements) {
      return 
    }

    setProcessing(true)

    try {
        const result = await stripe.confirmPayment({
            elements,
            // confirmParams?: Partial<ConfirmPaymentData> | undefined;
            redirect: "if_required"
        })
        
      if (result.error) {
        setError(result.error.message ?? 'An unknown error occurred')
      }else if(result.paymentIntent){
        const confirmSubscription = async () => {
            try {
              const res = await api.post('/auth/confirm-subscription', { price, plan,paymentIntent:result.paymentIntent})
                if(res.data){
                    if(res.data.userDta){
                        setUser(res.data.userDta)
                    }
                    setConfirmationData(res.data)
                    setpaymentStatus(true)
                }else{
                //  canseled logic
                }
            } catch (error) {
              console.error('Error confirming subscription:', error)
            }
          }
      
          confirmSubscription()
      }
    } catch (e) {
      setError('An error occurred while processing your payment')
    }

    setProcessing(false)
  }
  
  if (paymentStatus && confirmationData) {
    return <PaymentConfirmation paymentInfo={confirmationData.paymentInfo} userDta={confirmationData.userDta} />
  }

  return (
    <form onSubmit={handleSubmit}  className="w-full max-w-md">
      <PaymentElement />
      {error && <div className="text-red-500 mt-2">{error}</div>}
      <Button
        type="submit"
        disabled={!stripe || processing}
        className="w-full bg-blue-500 hover:bg-blue-600 mt-4"
      >
        {processing ? 'Processing...' : 'Pay Now'}
      </Button>
    </form>
  )
}

const PaymentSection: React.FC<PaymentSectionProps> = ({ plan, price }) => {
  const [clientSecret, setClientSecret] = useState<string | null>(null)
  const { user } = useAuthStore()
  const api = createAxiosInstance()

  useEffect(() => {
    const fetchPaymentIntent = async () => {
      try {
        const response = await api.post('/payment/create-payment-intent', { price })
        setClientSecret(response.data.clientSecret)
      } catch (error) {
        console.error('Error fetching payment intent:', error)
      }
    }

    fetchPaymentIntent()
  },[price])


  return (
    <div className="w-full h-full flex flex-col items-center justify-center text-white">
      <h2 className="text-2xl font-bold mb-4">Payment for {plan} Plan</h2>
      <p className="text-xl mb-8">Price: ${price} USD/year</p>
      {clientSecret ? (
        <Elements stripe={stripePromise} options={{ clientSecret }}>
          <CheckoutForm price={price} plan={plan} />
        </Elements>
      ) : (
        <div className="flex flex-col items-center justify-center">
          <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
          <p className="mt-2 text-lg">Preparing payment form...</p>
        </div>
      )}
    </div>
  )
}

export default PaymentSection