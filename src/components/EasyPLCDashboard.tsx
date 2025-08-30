import React, { useState, useEffect } from 'react';
import { 
  LayoutDashboard, 
  History, 
  Settings, 
  Sun, 
  Moon, 
  Mic, 
  Copy, 
  Play, 
  Cpu,
  User,
  Loader2,
  CheckCircle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Card } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  active?: boolean;
}

const EasyPLCDashboard: React.FC = () => {
  const [isDarkMode, setIsDarkMode] = useState(true);
  const [activeNav, setActiveNav] = useState('dashboard');
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedCode, setGeneratedCode] = useState({
    structuredText: `PROGRAM MainProgram
VAR
    StartButton : BOOL := FALSE;
    StopButton : BOOL := FALSE;
    Motor1 : BOOL := FALSE;
    Timer1 : TON;
END_VAR

// Main logic
IF StartButton AND NOT StopButton THEN
    Motor1 := TRUE;
    Timer1(IN := Motor1, PT := T#5S);
    
    IF Timer1.Q THEN
        Motor1 := FALSE;
    END_IF;
ELSE
    Motor1 := FALSE;
    Timer1(IN := FALSE);
END_IF;

END_PROGRAM`,
    ladderLogic: 'Visual Ladder Diagram will be displayed here'
  });
  
  const { toast } = useToast();

  const navigationItems: NavigationItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: activeNav === 'dashboard' },
    { id: 'history', label: 'History', icon: History, active: activeNav === 'history' },
    { id: 'settings', label: 'Settings', icon: Settings, active: activeNav === 'settings' }
  ];

  useEffect(() => {
    // Apply theme to document
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDarkMode]);

  const handleThemeToggle = () => {
    setIsDarkMode(!isDarkMode);
    toast({
      title: `Switched to ${isDarkMode ? 'Light' : 'Dark'} Mode`,
      description: `Theme updated successfully`
    });
  };

  const handleGenerateCode = async () => {
    if (!inputText.trim()) {
      toast({
        title: "Input Required",
        description: "Please describe the machine logic you want to generate.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate API call delay
      await new Promise(resolve => setTimeout(resolve, 2500));
      
      // TODO: Implement API call to Hugging Face backend
      // const response = await fetch('/api/generate-plc-code', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ description: inputText })
      // });
      
      // Mock generated code based on input
      const mockSTCode = `PROGRAM GeneratedProgram
VAR
    // Generated variables based on: "${inputText}"
    InputSensor : BOOL := FALSE;
    OutputActuator : BOOL := FALSE;
    SafetyStop : BOOL := FALSE;
    ProcessTimer : TON;
    Counter : CTU;
END_VAR

// Generated logic
IF InputSensor AND NOT SafetyStop THEN
    ProcessTimer(IN := TRUE, PT := T#3S);
    
    IF ProcessTimer.Q THEN
        OutputActuator := TRUE;
        Counter(CU := TRUE, RESET := FALSE, PV := 10);
    END_IF;
ELSE
    ProcessTimer(IN := FALSE);
    OutputActuator := FALSE;
END_IF;

END_PROGRAM`;

      setGeneratedCode({
        structuredText: mockSTCode,
        ladderLogic: `Ladder Logic generated for: "${inputText.substring(0, 50)}..."`
      });

      toast({
        title: "Code Generated Successfully",
        description: "Your PLC code has been generated and is ready for review."
      });
      
    } catch (error) {
      toast({
        title: "Generation Failed",
        description: "Failed to generate PLC code. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSimulate = () => {
    toast({
      title: "Simulation Started",
      description: "Running simulation with generated code..."
    });
  };

  const handleCopyCode = (codeType: string) => {
    const code = codeType === 'st' ? generatedCode.structuredText : generatedCode.ladderLogic;
    navigator.clipboard.writeText(code);
    toast({
      title: "Code Copied",
      description: `${codeType === 'st' ? 'Structured Text' : 'Ladder Logic'} copied to clipboard.`
    });
  };

  const handleVoiceInput = () => {
    toast({
      title: "Voice Input",
      description: "Voice input feature will be available soon."
    });
  };

  return (
    <div className="flex h-screen w-full bg-background overflow-hidden">
      {/* Sidebar */}
      <aside className="w-64 bg-sidebar border-r border-sidebar-border flex flex-col animate-slide-in-left">
        {/* Logo */}
        <div className="p-6 border-b border-sidebar-border">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-industrial-primary to-industrial-secondary rounded-lg flex items-center justify-center">
              <Cpu className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-xl font-bold text-sidebar-foreground">EasyPLC</h1>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4">
          <div className="space-y-2">
            {navigationItems.map((item) => {
              const IconComponent = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveNav(item.id)}
                  className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg transition-smooth ${
                    item.active 
                      ? 'bg-sidebar-accent text-sidebar-accent-foreground shadow-industrial' 
                      : 'text-sidebar-foreground hover:bg-sidebar-accent/50'
                  }`}
                >
                  <IconComponent className="w-5 h-5" />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        {/* Theme Toggle & User Profile */}
        <div className="p-4 border-t border-sidebar-border space-y-3">
          {/* Theme Toggle */}
          <Button
            onClick={handleThemeToggle}
            variant="ghost"
            size="sm"
            className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent/50"
          >
            {isDarkMode ? (
              <>
                <Sun className="w-4 h-4 mr-3" />
                Light Mode
              </>
            ) : (
              <>
                <Moon className="w-4 h-4 mr-3" />
                Dark Mode
              </>
            )}
          </Button>

          {/* User Profile */}
          <div className="flex items-center space-x-3 p-2 rounded-lg bg-sidebar-accent/30">
            <div className="w-8 h-8 bg-sidebar-primary rounded-full flex items-center justify-center">
              <User className="w-4 h-4 text-sidebar-primary-foreground" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-sidebar-foreground truncate">
                PLC Engineer
              </p>
              <p className="text-xs text-sidebar-foreground/60 truncate">
                engineer@company.com
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card border-b border-border p-6 animate-fade-in">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-bold text-foreground">PLC Code Generator</h2>
              <p className="text-muted-foreground">Describe your automation requirements and generate PLC code instantly</p>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-industrial-success rounded-full animate-pulse"></div>
              <span className="text-sm text-muted-foreground">System Ready</span>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <div className="flex-1 p-6 overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 h-full">
            {/* Input Panel */}
            <Card className="p-6 flex flex-col animate-fade-in bg-card shadow-elevated">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-xl font-semibold text-card-foreground">Describe Machine Logic</h3>
                <Button
                  onClick={handleVoiceInput}
                  variant="outline"
                  size="sm"
                  className="transition-spring hover:shadow-industrial"
                >
                  <Mic className="w-4 h-4" />
                </Button>
              </div>

              <Textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Describe your automation logic here... 

For example:
- Start motor when button pressed
- Stop motor after 5 seconds or when stop button pressed
- Include safety interlocks
- Add process monitoring"
                className="flex-1 min-h-[300px] resize-none bg-input border-border text-foreground placeholder:text-muted-foreground focus:ring-industrial-primary"
                disabled={isLoading}
              />

              <div className="flex space-x-3 mt-6">
                <Button
                  onClick={handleGenerateCode}
                  disabled={isLoading}
                  className="flex-1 bg-gradient-to-r from-industrial-primary to-industrial-secondary hover:shadow-industrial transition-spring"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Generating...
                    </>
                  ) : (
                    <>
                      <Cpu className="w-4 h-4 mr-2" />
                      Generate Code
                    </>
                  )}
                </Button>
                
                <Button
                  onClick={handleSimulate}
                  variant="outline"
                  disabled={isLoading}
                  className="border-industrial-secondary text-industrial-secondary hover:bg-industrial-secondary hover:text-white transition-spring"
                >
                  <Play className="w-4 h-4 mr-2" />
                  Simulate
                </Button>
              </div>
            </Card>

            {/* Output Panel */}
            <div className="flex flex-col space-y-6">
              {/* Structured Text */}
              <Card className={`p-6 flex-1 animate-fade-in bg-card shadow-elevated ${isLoading ? 'pulse-glow' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Structured Text (ST)</h3>
                  <Button
                    onClick={() => handleCopyCode('st')}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="hover:bg-muted transition-smooth"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <pre className={`code-block p-4 rounded-lg text-sm font-mono overflow-auto max-h-[300px] ${
                    isLoading ? 'animate-pulse' : ''
                  }`}>
                    <code className="text-code-foreground">
                      {isLoading ? 'Generating structured text...' : generatedCode.structuredText}
                    </code>
                  </pre>
                  {!isLoading && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-industrial-success" />
                    </div>
                  )}
                </div>
              </Card>

              {/* Ladder Logic */}
              <Card className={`p-6 flex-1 animate-fade-in bg-card shadow-elevated ${isLoading ? 'pulse-glow' : ''}`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-card-foreground">Ladder Logic (LD)</h3>
                  <Button
                    onClick={() => handleCopyCode('ld')}
                    variant="ghost"
                    size="sm"
                    disabled={isLoading}
                    className="hover:bg-muted transition-smooth"
                  >
                    <Copy className="w-4 h-4" />
                  </Button>
                </div>

                <div className="relative">
                  <div className={`bg-muted/30 border border-border rounded-lg p-6 min-h-[200px] flex items-center justify-center ${
                    isLoading ? 'animate-pulse' : ''
                  }`}>
                    {isLoading ? (
                      <div className="text-center">
                        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-2 text-industrial-primary" />
                        <p className="text-sm text-muted-foreground">Generating ladder diagram...</p>
                      </div>
                    ) : (
                      <div className="text-center">
                        <div className="w-16 h-16 bg-industrial-primary/20 rounded-full flex items-center justify-center mx-auto mb-4">
                          <LayoutDashboard className="w-8 h-8 text-industrial-primary" />
                        </div>
                        <p className="text-sm text-muted-foreground">{generatedCode.ladderLogic}</p>
                        <p className="text-xs text-muted-foreground/60 mt-2">Visual diagram rendering coming soon</p>
                      </div>
                    )}
                  </div>
                  {!isLoading && (
                    <div className="absolute top-2 right-2">
                      <CheckCircle className="w-4 h-4 text-industrial-success" />
                    </div>
                  )}
                </div>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default EasyPLCDashboard;