import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CreditCard } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

export default function PaymentForm({ amount, onSuccess, onCancel }) {
    const [isProcessing, setIsProcessing] = useState(false);
    const { toast } = useToast();

    // Simulated payment processing
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsProcessing(true);

        // Simulate API call
        setTimeout(() => {
            setIsProcessing(false);
            // Simulating successful payment
            if (Math.random() > 0.1) { // 90% success rate
                onSuccess();
            } else {
                toast({
                    variant: "destructive",
                    title: "Payment Failed",
                    description: "Please try again or use a different payment method.",
                });
            }
        }, 2000);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
                <Label htmlFor="cardNumber">Card Number</Label>
                <Input
                    id="cardNumber"
                    placeholder="4242 4242 4242 4242"
                    required
                    maxLength={19}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                    <Label htmlFor="expiry">Expiry</Label>
                    <Input
                        id="expiry"
                        placeholder="MM/YY"
                        required
                        maxLength={5}
                    />
                </div>
                <div className="space-y-2">
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                        id="cvv"
                        placeholder="123"
                        required
                        maxLength={3}
                        type="password"
                    />
                </div>
            </div>

            <div className="pt-4 space-y-4">
                <Button
                    type="submit"
                    className="w-full"
                    disabled={isProcessing}
                >
                    {isProcessing ? (
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    ) : (
                        <CreditCard className="mr-2 h-4 w-4" />
                    )}
                    Pay ₹{amount}
                </Button>

                <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={onCancel}
                    disabled={isProcessing}
                >
                    Cancel
                </Button>
            </div>
        </form>
    );
}
