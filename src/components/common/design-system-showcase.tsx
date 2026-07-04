import { BellIcon, PlusIcon, TrashIcon } from 'lucide-react';
import { toast } from 'sonner';

import { PageContainer, PageHeader, Section, Stack } from '@/components/common/layout';
import { Typography } from '@/components/common/typography/typography';
import { Alert, AlertContent, AlertDescription, AlertIcon, AlertTitle } from '@/components/ui/alert';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { getInitials } from '@/lib/utils';

const BUTTON_VARIANTS = ['default', 'secondary', 'outline', 'ghost', 'destructive', 'link'] as const;
const BADGE_VARIANTS = ['default', 'secondary', 'destructive', 'outline', 'ghost', 'link'] as const;
const TYPE_SPECIMENS = [
    { variant: 'h1', label: 'Heading 1' },
    { variant: 'h2', label: 'Heading 2' },
    { variant: 'h3', label: 'Heading 3' },
    { variant: 'h4', label: 'Heading 4' },
    { variant: 'lead', label: 'Lead paragraph' },
    { variant: 'body', label: 'Body text' },
    { variant: 'muted', label: 'Muted text' },
    { variant: 'caption', label: 'Caption' },
] as const;
const SWATCHES = [
    { name: 'Primary', className: 'bg-primary' },
    { name: 'Secondary', className: 'bg-secondary' },
    { name: 'Accent', className: 'bg-accent' },
    { name: 'Muted', className: 'bg-muted' },
    { name: 'Destructive', className: 'bg-destructive' },
    { name: 'Sidebar', className: 'bg-sidebar' },
] as const;

/**
 * DesignSystemShowcase — a living style guide that renders every foundational
 * token and primitive. Serves as visual verification that the design system is
 * wired correctly and as reference documentation for feature teams.
 */
function DesignSystemShowcase() {
    return (
        <PageContainer>
            <PageHeader
                title="ProjectOS Design System"
                description="Foundational tokens, primitives and layout standards."
                actions={
                    <Button onClick={() => toast.success('Design system is live!')}>
                        <BellIcon /> Toast
                    </Button>
                }
            />

            <Stack gap="xl">
                <Section title="Colors" description="Semantic surface tokens — all values sourced from index.css.">
                    <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
                        {SWATCHES.map((swatch) => (
                            <div key={swatch.name} className="flex flex-col gap-2">
                                <div className={`h-16 w-full rounded-lg border ${swatch.className}`} />
                                <Typography variant="caption">{swatch.name}</Typography>
                            </div>
                        ))}
                    </div>
                </Section>

                <Section title="Typography" description="Token-driven type scale via the Typography primitive.">
                    <Stack gap="sm">
                        {TYPE_SPECIMENS.map((spec) => (
                            <Typography key={spec.variant} variant={spec.variant}>
                                {spec.label}
                            </Typography>
                        ))}
                    </Stack>
                </Section>

                <Section title="Buttons" description="Variants and sizes.">
                    <Stack direction="row" gap="sm" wrap align="center">
                        {BUTTON_VARIANTS.map((variant) => (
                            <Button key={variant} variant={variant}>
                                {variant}
                            </Button>
                        ))}
                    </Stack>
                    <Stack direction="row" gap="sm" wrap align="center">
                        <Button size="sm">Small</Button>
                        <Button size="default">Default</Button>
                        <Button size="lg">Large</Button>
                        <Button size="icon" aria-label="Add">
                            <PlusIcon />
                        </Button>
                        <Button size="icon" variant="destructive" aria-label="Delete">
                            <TrashIcon />
                        </Button>
                    </Stack>
                </Section>

                <Section title="Badges">
                    <Stack direction="row" gap="sm" wrap align="center">
                        {BADGE_VARIANTS.map((variant) => (
                            <Badge key={variant} variant={variant}>
                                {variant}
                            </Badge>
                        ))}
                    </Stack>
                </Section>

                <Section title="Form controls">
                    <div className="grid gap-6 sm:grid-cols-2">
                        <Stack gap="sm">
                            <Label htmlFor="ds-name">Name</Label>
                            <Input id="ds-name" placeholder="Enter your name" />
                        </Stack>
                        <Stack gap="sm">
                            <Label htmlFor="ds-role">Role</Label>
                            <Select>
                                <SelectTrigger id="ds-role">
                                    <SelectValue placeholder="Select a role" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="admin">Admin</SelectItem>
                                    <SelectItem value="manager">Manager</SelectItem>
                                    <SelectItem value="member">Member</SelectItem>
                                </SelectContent>
                            </Select>
                        </Stack>
                        <Stack gap="sm" className="sm:col-span-2">
                            <Label htmlFor="ds-notes">Notes</Label>
                            <Textarea id="ds-notes" placeholder="Add a note…" />
                        </Stack>
                        <Stack direction="row" gap="md" align="center">
                            <Label className="gap-2">
                                <Checkbox defaultChecked /> Subscribe
                            </Label>
                            <Label className="gap-2">
                                <Switch defaultChecked /> Notifications
                            </Label>
                        </Stack>
                    </div>
                </Section>

                <Section title="Cards & tabs">
                    <div className="grid gap-4 sm:grid-cols-2">
                        <Card>
                            <CardHeader>
                                <CardTitle>Project Alpha</CardTitle>
                                <CardDescription>Active · 12 members</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <Stack direction="row" gap="sm" align="center">
                                    <Avatar>
                                        <AvatarFallback>{getInitials('Ada Lovelace')}</AvatarFallback>
                                    </Avatar>
                                    <Typography variant="muted">Led by Ada Lovelace</Typography>
                                </Stack>
                            </CardContent>
                        </Card>
                        <Card>
                            <CardContent>
                                <Tabs defaultValue="overview">
                                    <TabsList>
                                        <TabsTrigger value="overview">Overview</TabsTrigger>
                                        <TabsTrigger value="tasks">Tasks</TabsTrigger>
                                    </TabsList>
                                    <TabsContent value="overview">
                                        <Typography variant="muted">Overview panel content.</Typography>
                                    </TabsContent>
                                    <TabsContent value="tasks">
                                        <Typography variant="muted">Tasks panel content.</Typography>
                                    </TabsContent>
                                </Tabs>
                            </CardContent>
                        </Card>
                    </div>
                </Section>

                <Section title="Alerts">
                    <Stack gap="sm">
                        <Alert>
                            <AlertIcon>
                                <BellIcon className="size-4" />
                            </AlertIcon>
                            <AlertContent>
                                <AlertTitle>Heads up</AlertTitle>
                                <AlertDescription>This is the default alert style.</AlertDescription>
                            </AlertContent>
                        </Alert>
                        <Alert variant="destructive">
                            <AlertIcon>
                                <TrashIcon className="size-4" />
                            </AlertIcon>
                            <AlertContent>
                                <AlertTitle>Destructive</AlertTitle>
                                <AlertDescription>Something needs your attention.</AlertDescription>
                            </AlertContent>
                        </Alert>
                    </Stack>
                </Section>
            </Stack>
        </PageContainer>
    );
}

export { DesignSystemShowcase };
