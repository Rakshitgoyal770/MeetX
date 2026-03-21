"use Client"
import {Button} from "@repo/ui/button";

export function AuthPage({isSignin} : {
    isSignin : boolean
}){
    return <div className="flex flex-col items-center justify-center h-screen">
              <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <input type="text" placeholder="Email" className="border p-2 mb-4 w-full" />
                <input type="password" placeholder="Password" className="border p-2 mb-4 w-full" />
                <Button varient="secondary" size="medium">{ isSignin ? "Sign In" : "Sign Up" }
                </Button>
              </div>
        </div>
}