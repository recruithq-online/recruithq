"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from "react";
import { initialExperts, type Expert } from "@/lib/experts";
import { Modal } from "./modal";
import { WaitlistForm, ListExpertiseForm } from "./forms";
import { ExpertProfile } from "./expert-profile";

type ModalState =
  | { type: "waitlist" }
  | { type: "list" }
  | { type: "expert"; id: number }
  | null;

interface Experience {
  experts: Expert[];
  query: string;
  setQuery: (query: string) => void;
  openModal: (modal: ModalState) => void;
  closeModal: () => void;
  vouch: (id: number) => void;
  refute: (id: number) => void;
  toast: (message: string) => void;
}

const ExperienceContext = createContext<Experience | null>(null);

export function useExperience() {
  const experience = useContext(ExperienceContext);
  if (!experience) throw new Error("ExperienceProvider is required.");
  return experience;
}

export function ExperienceProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [experts, setExperts] = useState(initialExperts);
  const [query, setQuery] = useState("");
  const [modal, openModal] = useState<ModalState>(null);
  const [message, setMessage] = useState("");
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const closeModal = useCallback(() => openModal(null), []);

  function toast(text: string) {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setMessage(text);
    toastTimer.current = setTimeout(() => setMessage(""), 2200);
  }
  useEffect(
    () => () => {
      if (toastTimer.current) clearTimeout(toastTimer.current);
    },
    [],
  );

  function vouch(id: number) {
    setExperts((current) =>
      current.map((expert) =>
        expert.id === id
          ? {
              ...expert,
              vouches: expert.vouches + 1,
              score: Math.min(100, expert.score + 1),
            }
          : expert,
      ),
    );
    toast(
      `Vouch added for ${experts.find((expert) => expert.id === id)?.name}`,
    );
  }
  function refute(id: number) {
    // The source only acknowledges refutes; it does not change scores or save claims.
    toast(
      `Refute noted for ${experts.find((expert) => expert.id === id)?.name}`,
    );
  }
  const selectedExpert =
    modal?.type === "expert"
      ? experts.find((expert) => expert.id === modal.id)
      : undefined;

  return (
    <ExperienceContext.Provider
      value={{
        experts,
        query,
        setQuery,
        openModal,
        closeModal,
        vouch,
        refute,
        toast,
      }}
    >
      {children}
      {modal && (
        <Modal
          onClose={closeModal}
          labelledBy={
            modal.type === "waitlist"
              ? "waitlist-title"
              : modal.type === "list"
                ? "list-title"
                : "profile-title"
          }
        >
          {modal.type === "waitlist" && <WaitlistForm />}
          {modal.type === "list" && <ListExpertiseForm />}
          {selectedExpert && <ExpertProfile expert={selectedExpert} />}
        </Modal>
      )}
      {message && (
        <div role="status" className="toast">
          {message}
        </div>
      )}
    </ExperienceContext.Provider>
  );
}
