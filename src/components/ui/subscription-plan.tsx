"use client"
import React, {useCallback, useState} from "react"
import {motion} from "framer-motion"
import {Toaster, toast} from "sonner"
import Image from "next/image"
import close from "../../../public/close-button.png"
import throttle from "lodash.throttle"
import {mcn} from "../lib/utils"
import {useRouter} from "next/navigation"
import {useWorkspaceStore} from "@/stores/workspaceStore"
import {createAxiosInstance} from "@/app/utils/axiosInstance"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./subscriptionCard"
import {Button} from "./button"
import PaymentSection from "./paymentSection"
const MAX_NAME_LENGTH = 15

interface SubscriptionPlanProps {
  isOpen: boolean
  onClose: () => void
}

const SubscriptionPlan: React.FC<SubscriptionPlanProps> = ({
  isOpen,
  onClose,
}) => {
  const api = createAxiosInstance()
  const [showPayment, setShowPayment] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<{
    name: string
    price: number
  } | null>(null)
  const handleUpgrade = (plan: string, price: number) => {
    setSelectedPlan({name: plan, price})
    setShowPayment(true)
  }
  return (
    <motion.div
      className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end"
      initial={{x: "100%"}}
      animate={{x: isOpen ? "0%" : "100%"}}
      exit={{x: "100%"}}
      transition={{type: "spring", stiffness: 300, damping: 30}}
    >
      <div className="relative bg-[#0d093d] w-screen h-full flex gap-6 px-24">
        <div className="absolute top-0 left-0 mt-12 ml-12">
          <Image
            alt="close"
            onClick={onClose}
            src={close}
            width={20}
            className="object-contain cursor-pointer"
          />
        </div>

          {/* <h1 className="text-3xl font-bold mb-8">Subscription Plan</h1> */}
          {!showPayment ? (
        <div className="absolute container w-full  mx-auto px-4 pl-52 py-8 flex flex-col">
            <>
              <section className="mb-2 ">
                <h2 className="text-base font-semibold mb-4">
                  Your Current Plan
                </h2>
                <div className="w-3/5 h-54 bg-gray-100/15 rounded-lg p-6">
                  <h3 className="text-sm font-medium mb-1">Free Plan</h3>
                  <p className="text-gray-300 text-xs">
                    You are currently on the Free Plan. Upgrade to create more
                    workspaces and access additional features.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-base font-semibold mb-4 border-t  w-3/5 border-gray-100 border-opacity-25 pt-2">
                  Available Plans
                </h2>
                <div className="flex flex-col md:flex-row gap-4">
                  <Card className="w-full md:w-1/5 h-80 bg-amber-100 ">
                    <CardHeader>
                      <CardTitle className="text-amber-800 text-lg">
                        Golden Plan
                      </CardTitle>
                      <h1 className="text-base ">$ 10 USD/ yeas</h1>

                      <CardDescription>
                        Perfect for growing teams
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-1 text-amber-900 text-sm">
                        <li>Create up to 10 workspaces</li>
                        {/* <li>Advanced collaboration tools</li> */}
                        <li>Priority support</li>
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full mt-7 bg-amber-500 hover:bg-amber-600"
                        onClick={() => handleUpgrade("Golden", 10)}
                      >
                        Upgrade to Golden
                      </Button>
                    </CardFooter>
                  </Card>

                  <Card className="w-full md:w-1/5 h-80 bg-slate-100 ">
                    <CardHeader>
                      <CardTitle className="text-slate-800 text-lg">
                        Platinum Plan
                      </CardTitle>
                      <h1 className="text-base ">$ 20 USD/ year</h1>

                      <CardDescription>
                        For power users and large organizations
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <ul className="list-disc list-inside space-y-2 text-slate-900 text-sm">
                        <li>Create up to 20 workspaces</li>
                        {/* <li>Advanced analytics and reporting</li> */}
                        <li>24/7 premium support</li>
                        {/* <li>Custom integrations</li> */}
                      </ul>
                    </CardContent>
                    <CardFooter>
                      <Button
                        className="w-full bg-slate-500 hover:bg-slate-600"
                        onClick={() => handleUpgrade("Platinum", 20)}
                      >
                        Upgrade to Platinum
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              </section>
            </>
              </div>
          ) : (
            <PaymentSection
              plan={selectedPlan?.name || ""}
              price={selectedPlan?.price || 0}
            />
          )}
      </div>
    </motion.div>
  )
}

export default SubscriptionPlan
