import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

interface FeatureCardProps {
  title: string;
  description: string;
  icon?: string;
  category?: string;
}

export function FeatureCard({ title, description, icon, category }: FeatureCardProps) {
  return (
    <Card className="h-full transition-all duration-200 hover:shadow-lg">
      <CardHeader>
        <div className="flex items-center space-x-2">
          {icon && (
            <div className="w-8 h-8 bg-primary/10 rounded-lg flex items-center justify-center">
              <span className="text-primary text-sm font-semibold">
                {icon.charAt(0).toUpperCase()}
              </span>
            </div>
          )}
          <div>
            <CardTitle className="text-lg">{title}</CardTitle>
            {category && (
              <span className="text-xs text-muted-foreground capitalize">
                {category}
              </span>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-sm leading-relaxed">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
}