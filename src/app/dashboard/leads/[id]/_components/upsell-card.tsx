import { getUpsellSuggestionsByLeadId } from '@/lib/data';
import type { UpsellSuggestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ShoppingCart } from 'lucide-react';
import { Button } from '@/components/ui/button';

function UpsellItem({ suggestion }: { suggestion: UpsellSuggestion }) {
  const confidenceColor = suggestion.confidence > 0.8 ? 'text-green-500' : 'text-amber-500';
  
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-2 rounded-full">
        <ShoppingCart className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold">{suggestion.productName}</h4>
            <Badge variant="outline" className={confidenceColor}>
                {Math.round(suggestion.confidence * 100)}% Match
            </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
        <Button variant="link" className="p-0 h-auto mt-1 text-primary">View Product</Button>
      </div>
    </div>
  );
}

export default function UpsellCard({ leadId }: { leadId: string }) {
  const suggestions = getUpsellSuggestionsByLeadId(leadId);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span>Upsell Opportunities</span>
        </CardTitle>
        <CardDescription>Based on purchase history and activity</CardDescription>
      </CardHeader>
      <CardContent>
        {suggestions.length > 0 ? (
          <div className="grid gap-6">
            {suggestions.map((suggestion) => (
              <UpsellItem key={suggestion.id} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No upsell opportunities found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
