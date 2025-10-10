import { AnimatedCounter } from "@/components/animated-counter";
import { Recycle, Users, Leaf, Trash2 } from "lucide-react";

const stats = [
  {
    icon: <Trash2 className="h-10 w-10 text-primary" />,
    value: 12580,
    label: "Tons of Waste Diverted",
    suffix: "+",
  },
  {
    icon: <Users className="h-10 w-10 text-primary" />,
    value: 50000,
    label: "Active Community Members",
    suffix: "+",
  },
  {
    icon: <Recycle className="h-10 w-10 text-primary" />,
    value: 1500000,
    label: "Items Recycled",
    suffix: "+",
  },
  {
    icon: <Leaf className="h-10 w-10 text-primary" />,
    value: 3000,
    label: "Tons of CO2 Emissions Reduced",
    suffix: "+",
  },
];

export function StatisticsSection() {
  return (
    <section id="statistics" className="w-full py-12 md:py-24 lg:py-32 bg-background">
      <div className="container px-4 md:px-6">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
          {stats.map((stat) => (
            <div key={stat.label} className="flex flex-col items-center justify-center text-center space-y-2">
              {stat.icon}
              <div className="font-headline text-4xl font-bold">
                <AnimatedCounter value={stat.value} />
                {stat.suffix}
              </div>
              <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
