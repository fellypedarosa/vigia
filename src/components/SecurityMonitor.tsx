import React, { useCallback, useEffect, useState } from 'react';
import { useWebcam } from '@/hooks/useWebcam';
import { useMotionDetection } from '@/hooks/useMotionDetection';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { EmailAlert } from '@/components/EmailAlert';
import { useToast } from '@/hooks/use-toast';
import { Webcam, Play, Pause, Square, Settings, Camera, Shield, AlertTriangle } from 'lucide-react';

type MonitoringState = 'stopped' | 'starting' | 'monitoring' | 'paused' | 'alert';

export const SecurityMonitor: React.FC = () => {
  const [monitoringState, setMonitoringState] = useState<MonitoringState>('stopped');
  const [capturedImages, setCapturedImages] = useState<Array<{ timestamp: number; image: string; score: number }>>([]);
  const [isMinimized, setIsMinimized] = useState(false);
  const { toast } = useToast();

  const {
    videoRef,
    isActive: cameraActive,
    error: cameraError,
    startCamera,
    stopCamera,
    captureFrame
  } = useWebcam();

  const handleMotionDetected = useCallback((score: number, frame: string) => {
    const timestamp = Date.now();
    
    // Adiciona captura à lista
    setCapturedImages(prev => [{
      timestamp,
      image: frame,
      score: Math.round(score)
    }, ...prev].slice(0, 10)); // Mantém apenas as 10 mais recentes

    // Mostra alerta
    setMonitoringState('alert');
    
    toast({
      title: "Movimento Detectado!",
      description: `Intensidade: ${Math.round(score)}% às ${new Date(timestamp).toLocaleTimeString()}`,
      variant: "destructive"
    });

    // Volta ao estado de monitoramento após 3 segundos
    setTimeout(() => {
      if (monitoringState !== 'stopped' && monitoringState !== 'paused') {
        setMonitoringState('monitoring');
      }
    }, 3000);
  }, [toast, monitoringState]);

  const {
    isDetecting,
    sensitivityLevel,
    lastMotionTime,
    motionScore,
    startDetection,
    stopDetection,
    setSensitivity
  } = useMotionDetection({
    sensitivity: 50,
    minMotionArea: 150,
    onMotionDetected: handleMotionDetected
  });

  const handleStart = useCallback(async () => {
    setMonitoringState('starting');
    
    try {
      await startCamera();
      // Aguarda um pouco para a câmera estabilizar
      setTimeout(() => {
        if (videoRef.current) {
          startDetection(videoRef.current);
          setMonitoringState('monitoring');
        }
      }, 1000);
    } catch (error) {
      setMonitoringState('stopped');
      toast({
        title: "Erro ao iniciar monitoramento",
        description: "Não foi possível acessar a câmera",
        variant: "destructive"
      });
    }
  }, [startCamera, startDetection, videoRef, toast]);

  const handlePause = useCallback(() => {
    stopDetection();
    setMonitoringState('paused');
  }, [stopDetection]);

  const handleResume = useCallback(() => {
    if (videoRef.current) {
      startDetection(videoRef.current);
      setMonitoringState('monitoring');
    }
  }, [startDetection, videoRef]);

  const handleStop = useCallback(() => {
    stopDetection();
    stopCamera();
    setMonitoringState('stopped');
  }, [stopDetection, stopCamera]);

  const getStatusInfo = () => {
    switch (monitoringState) {
      case 'starting':
        return { 
          text: 'Iniciando...', 
          color: 'bg-monitoring-warning',
          icon: Settings 
        };
      case 'monitoring':
        return { 
          text: 'Monitorando', 
          color: 'bg-monitoring-active shadow-success',
          icon: Shield 
        };
      case 'paused':
        return { 
          text: 'Pausado', 
          color: 'bg-monitoring-inactive',
          icon: Pause 
        };
      case 'alert':
        return { 
          text: 'Movimento Detectado!', 
          color: 'bg-monitoring-alert shadow-alert animate-pulse-security',
          icon: AlertTriangle 
        };
      default:
        return { 
          text: 'Parado', 
          color: 'bg-muted',
          icon: Square 
        };
    }
  };

  const statusInfo = getStatusInfo();
  const StatusIcon = statusInfo.icon;

  if (isMinimized) {
    return (
      <div className="fixed bottom-4 right-4 z-50">
        <Card className="w-64 bg-card/95 backdrop-blur border-border">
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <StatusIcon className="h-4 w-4" />
                <Badge className={statusInfo.color}>
                  {statusInfo.text}
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsMinimized(false)}
              >
                Expandir
              </Button>
            </div>
            {monitoringState === 'monitoring' && (
              <div className="mt-2 text-xs text-muted-foreground">
                Sensibilidade: {sensitivityLevel}% | Score: {Math.round(motionScore)}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background p-4">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <div>
              <h1 className="text-2xl font-bold">Monitor de Segurança</h1>
              <p className="text-muted-foreground">Sistema de detecção de movimento</p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsMinimized(true)}
          >
            Minimizar
          </Button>
        </div>

        {/* Status Card */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <StatusIcon className="h-5 w-5" />
              Status do Sistema
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between mb-4">
              <Badge className={`${statusInfo.color} text-white px-4 py-2`}>
                {statusInfo.text}
              </Badge>
              {lastMotionTime && (
                <span className="text-sm text-muted-foreground">
                  Último movimento: {new Date(lastMotionTime).toLocaleTimeString()}
                </span>
              )}
            </div>

            {/* Controls */}
            <div className="flex gap-2 flex-wrap">
              {monitoringState === 'stopped' && (
                <Button 
                  onClick={handleStart}
                  variant="security"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Iniciar Monitoramento
                </Button>
              )}
              
              {monitoringState === 'monitoring' && (
                <Button 
                  onClick={handlePause}
                  variant="secondary"
                >
                  <Pause className="h-4 w-4 mr-2" />
                  Pausar
                </Button>
              )}
              
              {monitoringState === 'paused' && (
                <Button 
                  onClick={handleResume}
                  variant="monitoring"
                >
                  <Play className="h-4 w-4 mr-2" />
                  Retomar
                </Button>
              )}
              
              {(monitoringState === 'monitoring' || monitoringState === 'paused' || monitoringState === 'alert') && (
                <Button 
                  onClick={handleStop}
                  variant="destructive"
                >
                  <Square className="h-4 w-4 mr-2" />
                  Parar
                </Button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Email Alert Info */}
        <EmailAlert />

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Video Feed */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webcam className="h-5 w-5" />
                Feed da Câmera
              </CardTitle>
            </CardHeader>
            <CardContent>
              {cameraError && (
                <Alert className="mb-4">
                  <AlertTriangle className="h-4 w-4" />
                  <AlertDescription>{cameraError}</AlertDescription>
                </Alert>
              )}
              
              <div className="relative bg-secondary rounded-lg overflow-hidden">
                <video
                  ref={videoRef}
                  className="w-full h-64 object-cover"
                  autoPlay
                  muted
                  playsInline
                />
                
                {!cameraActive && (
                  <div className="absolute inset-0 flex items-center justify-center bg-secondary">
                    <div className="text-center">
                      <Camera className="h-12 w-12 mx-auto mb-2 text-muted-foreground" />
                      <p className="text-muted-foreground">Câmera desativada</p>
                    </div>
                  </div>
                )}

                {/* Motion indicator */}
                {isDetecting && (
                  <div className="absolute top-2 right-2 flex items-center gap-2">
                    <div className="flex items-center gap-1 bg-black/50 px-2 py-1 rounded">
                      <div className="w-2 h-2 bg-monitoring-active rounded-full animate-pulse" />
                      <span className="text-xs text-white">DETECTANDO</span>
                    </div>
                  </div>
                )}
                
                {/* Motion score */}
                {isDetecting && motionScore > 0 && (
                  <div className="absolute bottom-2 left-2 bg-black/50 px-2 py-1 rounded">
                    <span className="text-xs text-white">
                      Score: {Math.round(motionScore)}%
                    </span>
                  </div>
                )}
              </div>

              {/* Sensitivity Control */}
              {(monitoringState === 'monitoring' || monitoringState === 'paused') && (
                <div className="mt-4 space-y-2">
                  <div className="flex justify-between items-center">
                    <label className="text-sm font-medium">Sensibilidade</label>
                    <span className="text-sm text-muted-foreground">{sensitivityLevel}%</span>
                  </div>
                  <Slider
                    value={[sensitivityLevel]}
                    onValueChange={(value) => setSensitivity(value[0])}
                    max={100}
                    min={1}
                    step={1}
                    className="w-full"
                  />
                </div>
              )}
            </CardContent>
          </Card>

          {/* Captured Images */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Camera className="h-5 w-5" />
                Capturas Recentes
              </CardTitle>
            </CardHeader>
            <CardContent>
              {capturedImages.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  <Camera className="h-12 w-12 mx-auto mb-2 opacity-50" />
                  <p>Nenhuma captura ainda</p>
                </div>
              ) : (
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {capturedImages.map((capture, index) => (
                    <div key={index} className="border rounded-lg p-3 bg-secondary/30">
                      <div className="flex justify-between items-center mb-2">
                        <span className="text-sm font-medium">
                          {new Date(capture.timestamp).toLocaleString()}
                        </span>
                        <Badge variant="outline">
                          Score: {capture.score}%
                        </Badge>
                      </div>
                      <img
                        src={capture.image}
                        alt={`Captura ${index + 1}`}
                        className="w-full h-32 object-cover rounded border"
                      />
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};