
import { LoginForm } from "@/components/auth/login-form";
import { getSettings } from "@/lib/actions/setting.actions";
import { ShoppingBag } from "lucide-react";
import Link from "next/link";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PhoneAuthForm } from "@/components/auth/phone-auth-form";

export default async function LoginPage() {
  const settings = await getSettings();
  return (
    <div className="mx-auto grid w-full max-w-[380px] gap-6">
      <div className="md:hidden absolute top-8 left-8">
          <Link
              href="/"
              className="flex items-center gap-2 text-lg font-semibold"
          >
              <ShoppingBag className="h-6 w-6" />
              <span>{settings.storeName || 'BlueCart'}</span>
          </Link>
      </div>
      <div className="grid gap-2 text-center">
        <h1 className="text-3xl font-bold">Login</h1>
        <p className="text-balance text-muted-foreground">
          Access your account
        </p>
      </div>
      <Tabs defaultValue="email" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="email">Email</TabsTrigger>
          <TabsTrigger value="phone">Phone</TabsTrigger>
        </TabsList>
        <TabsContent value="email">
          <LoginForm />
        </TabsContent>
        <TabsContent value="phone">
          <PhoneAuthForm />
        </TabsContent>
      </Tabs>
      <div className="mt-4 text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/signup" className="underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
