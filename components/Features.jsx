import { TrendingUp, PieChart, Shield } from "lucide-react";

export function FeaturesSection() {
  const features = [
    {
      icon: TrendingUp,
      title: "Track income & expenses",
      description: "Monitor your money flow with easy-to-use tracking tools"
    },
    {
      icon: PieChart,
      title: "Visualize spending with charts",
      description: "See where your money goes with beautiful, interactive charts"
    },
    {
      icon: Shield,
      title: "Secure & private",
      description: "Your financial data is protected with bank-level security"
    }
  ];

  return (
    <section className="py-20 px-6 bg-white">
      <div className="max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const IconComponent = feature.icon;
            return (
              <div 
                key={index}
                className="rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
                style={{ backgroundColor: '#F4EDFC' }}
              >
                <div className="space-y-4">
                  <div 
                    className="w-16 h-16 rounded-xl flex items-center justify-center"
                    style={{ backgroundColor: '#431376' }}
                  >
                    <IconComponent className="w-8 h-8 text-white" />
                  </div>
                  
                  <h3 
                    className="text-xl font-semibold"
                    style={{ color: '#431376' }}
                  >
                    {feature.title}
                  </h3>
                  
                  <p 
                    className="leading-relaxed"
                    style={{ color: '#431376', opacity: 0.8 }}
                  >
                    {feature.description}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}