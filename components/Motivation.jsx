"use client";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";


export function MotivationSection() {
  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-4xl mx-auto text-center space-y-8">
        <h2 
          className="text-4xl lg:text-5xl font-bold leading-tight"
          style={{ color: '#431376' }}
        >
          Take control of your finances today
        </h2>
        
        <div className="pt-8">
          <Button 
            size="lg"
            className="px-12 py-6 text-xl font-semibold rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            style={{ 
              backgroundColor: '#431376', 
              color: 'white',
              border: 'none'
            }}
            onClick={() => router.push('/signin')}
          >
            Get Started Free
          </Button>
        </div>
        
        <p 
          className="text-lg opacity-80"
          style={{ color: '#431376' }}
        >
          No credit card required • Free forever
        </p>
      </div>
    </section>
  );
}