import * as Dialog from "@radix-ui/react-dialog";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";
import { X } from "lucide-react";
import { ChangeEvent, FormEvent, useState } from "react";
import { toast } from "sonner";

interface NoteCardProps {
  note: {
    id: string;
    date: Date;
    content: string;
  };
  onNoteDeleted: (id: string) => void;
  onNoteUpdated: (id: string, content: string) => void;
}

export function NoteCard({ note, onNoteDeleted, onNoteUpdated }: NoteCardProps) {
  const [shouldShowOnboarding, setShouldShowOnboarding] = useState(true);
  const [content, setContent] = useState(note.content);

  function handleStartEditor() {
    setShouldShowOnboarding(false);
  }

  function handleContentChanged(event: ChangeEvent<HTMLTextAreaElement>) {
    setContent(event.target.value);
  }

  function handleSaveNote(event: FormEvent) {
    event.preventDefault();

    if (content === "") {
      return;
    }

    onNoteUpdated(note.id, content);
    setShouldShowOnboarding(true);

    toast.success("Nota atualizada com sucesso!");
  }

  return (
    <Dialog.Root>
      <Dialog.Trigger className="rounded-md text-left bg-slate-800 flex flex-col p-5 gap-3 overflow-hidden relative hover:ring-2 hover:ring-slate-600 focus-visible:ring-2 focus-visible:ring-lime-400 outline-none">
        <span className="text-sm font-medium text-slate-300">
          {formatDistanceToNow(note.date, {
            locale: ptBR,
            addSuffix: true,
          })}
        </span>

        <p className="text-sm leading-6 text-slate-400">{note.content}</p>

        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-black/0 pointer-events-none" />
      </Dialog.Trigger>

      <Dialog.Portal>
        <Dialog.Overlay className="inset-0 fixed bg-black/50" />
        <Dialog.Content className="fixed overflow-hidden inset-0 md:inset-auto md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 md:max-w-[640px] w-full md:h-[60vh] bg-slate-700 md:rounded-md flex flex-col outline-none">
          <Dialog.Close className="absolute right-0 top-0 bg-slate-800 p-1.5 text-slate-400 hover:text-slate-100">
            <X className="size-5" />
          </Dialog.Close>

          <form className="flex-1 flex flex-col">
            <div className="flex flex-1 flex-col gap-3 p-5">
              <span className="text-sm font-medium text-slate-300">
                  {formatDistanceToNow(note.date, {
                    locale: ptBR,
                    addSuffix: true,
                  })}
              </span>

              {shouldShowOnboarding ? (
                  <div className="flex flex-1">
                      <textarea
                        className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"                     
                        value={content} />
                  </div>
                ):(
                    <div className="flex flex-1">
                      <textarea
                        autoFocus
                        className="text-sm leading-6 text-slate-400 bg-transparent resize-none flex-1 outline-none"
                        onChange={handleContentChanged}
                        value={content} />
                    </div>
                )}

              
              
            </div>

            {shouldShowOnboarding ? (
              <p className="w-full bg-slate-800 py-4 text-center text-sm text-slate-300 outline-none font-medium group">
                Deseja{" "}
                <button
                  type="button"
                  onClick={handleStartEditor}
                  className="font-medium group text-red-400 hover:underline"
                >
                  editar
                </button>{" "}
                ou{" "}
                <button
                  type="button"
                  onClick={() => onNoteDeleted(note.id)}
                  className="font-medium group text-red-400 hover:underline"
                >
                  apagar
                </button>{" "}
                essa nota?
              </p>
            ):(
              <button
                type="button"
                onClick={handleSaveNote}                    
                className="w-full bg-lime-400 py-4 text-center text-sm text-lime-950 outline-none font-medium hover:bg-lime-500"
              >
                Salvar nota
              </button>
            )}

          </form>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
