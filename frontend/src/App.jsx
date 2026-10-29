import { useState } from "react";
import { MoreHorizontal, Trash2, Pencil } from "lucide-react";
import Button from "./components/ui/Button";
import IconButton from "./components/ui/IconButton";
import ConfirmDialog from "./components/ui/ConfirmDialog";
import Dialog from "./components/ui/Dialog";
import {
  DropdownMenu,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "./components/ui/DropdownMenu";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "./components/ui/Tabs";

export default function App() {
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);

  return (
    <main className="min-h-screen bg-ivory p-8">
      <div className="mx-auto flex max-w-2xl flex-col gap-6">
        <h1 className="font-serif text-3xl text-charcoal">Phase 2 overlays</h1>

        <div className="flex flex-wrap gap-3">
          <Button onClick={() => setDialogOpen(true)}>Open Dialog</Button>
          <Button variant="danger" onClick={() => setConfirmOpen(true)}>
            Open Confirm
          </Button>

          <DropdownMenu
            trigger={
              <IconButton label="Album actions">
                <MoreHorizontal size={18} />
              </IconButton>
            }
          >
            <DropdownMenuItem onSelect={() => setDialogOpen(true)}>
              <Pencil size={14} /> Edit details
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem danger onSelect={() => setConfirmOpen(true)}>
              <Trash2 size={14} /> Delete album
            </DropdownMenuItem>
          </DropdownMenu>
        </div>

        <Tabs defaultValue="photos">
          <TabsList>
            <TabsTrigger value="photos">Photos</TabsTrigger>
            <TabsTrigger value="details">Album Details</TabsTrigger>
            <TabsTrigger value="privacy">Privacy</TabsTrigger>
            <TabsTrigger value="client">Client</TabsTrigger>
          </TabsList>
          <TabsContent value="photos">
            <p className="text-sm text-charcoal/60">Photos tab content.</p>
          </TabsContent>
          <TabsContent value="details">
            <p className="text-sm text-charcoal/60">Details tab content.</p>
          </TabsContent>
          <TabsContent value="privacy">
            <p className="text-sm text-charcoal/60">Privacy tab content.</p>
          </TabsContent>
          <TabsContent value="client">
            <p className="text-sm text-charcoal/60">Client tab content.</p>
          </TabsContent>
        </Tabs>
      </div>

      <Dialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        title="Edit album details"
        description="Changes are visible to you immediately."
        footer={
          <>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={() => setDialogOpen(false)}>Save changes</Button>
          </>
        }
      >
        <p className="text-sm text-charcoal/70">Dialog body content goes here.</p>
      </Dialog>

      <ConfirmDialog
        open={confirmOpen}
        onOpenChange={setConfirmOpen}
        title="Delete this album?"
        description="This action cannot be undone. The album and its photos will be permanently removed."
        confirmLabel="Delete album"
        danger
        onConfirm={() => setConfirmOpen(false)}
      />
    </main>
  );
}