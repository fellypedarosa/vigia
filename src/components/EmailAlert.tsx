import React from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Mail, ExternalLink } from 'lucide-react';

export const EmailAlert: React.FC = () => {
  return (
    <Alert className="border-monitoring-warning/50 bg-monitoring-warning/10">
      <Mail className="h-4 w-4" />
      <AlertDescription className="flex items-center justify-between">
        <div>
          <p className="font-medium mb-1">Alertas por E-mail</p>
          <p className="text-sm text-muted-foreground">
            Para ativar o envio automático de alertas por e-mail quando movimento for detectado, 
            conecte seu projeto ao Supabase.
          </p>
        </div>
        <Button variant="outline" size="sm" className="ml-4 whitespace-nowrap">
          <ExternalLink className="h-4 w-4 mr-2" />
          Conectar Supabase
        </Button>
      </AlertDescription>
    </Alert>
  );
};