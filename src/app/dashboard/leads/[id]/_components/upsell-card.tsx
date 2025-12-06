'use client';
import { useState, useEffect } from 'react';
import type { Lead, UpsellSuggestion } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Lightbulb, ShoppingCart, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { generateUpsellSuggestionsAction } from '@/app/actions';
import { useToast } from '@/hooks/use-toast';


function UpsellItem({ suggestion }: { suggestion: UpsellSuggestion }) {
  const confidence = suggestion.confidence || 0;
  const confidenceColor = confidence > 0.8 ? 'text-green-500' : 'text-amber-500';
  
  return (
    <div className="flex items-start gap-4">
      <div className="bg-primary/10 p-2 rounded-full">
        <ShoppingCart className="h-5 w-5 text-primary" />
      </div>
      <div className="flex-1">
        <div className="flex justify-between items-center">
            <h4 className="font-semibold">{suggestion.productName}</h4>
            <Badge variant="outline" className={confidenceColor}>
                {Math.round(confidence * 100)}% Match
            </Badge>
        </div>
        <p className="text-sm text-muted-foreground">{suggestion.reason}</p>
        <Button variant="link" className="p-0 h-auto mt-1 text-primary">View Product</Button>
      </div>
    </div>
  );
}

export default function UpsellCard({ lead }: { lead: Lead }) {
  const [suggestions, setSuggestions] = useState<UpsellSuggestion[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    async function fetchSuggestions() {
      setIsLoading(true);
      const result = await generateUpsellSuggestionsAction({
        company: lead.company || 'their company',
        recentActivity: lead.recentActivity,
        existingServices: lead.purchaseHistory.map(p => p.productName),
      });

      if (result.success && result.data) {
        setSuggestions(result.data.suggestions);
      } else {
        toast({
            variant: 'destructive',
            title: 'Failed to get suggestions',
            description: result.error,
        });
      }
      setIsLoading(false);
    }
    fetchSuggestions();
  }, [lead, toast]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <span>AI-Powered Upsell Opportunities</span>
        </CardTitle>
        <CardDescription>Suggested based on lead profile and activity.</CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
            <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-primary animate-spin" />
            </div>
        ) : suggestions.length > 0 ? (
          <div className="grid gap-6">
            {suggestions.map((suggestion, index) => (
              <UpsellItem key={index} suggestion={suggestion} />
            ))}
          </div>
        ) : (
          <div className="text-center text-muted-foreground py-8">
            <p>No specific upsell opportunities found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
