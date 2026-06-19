import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react';
import { BRANCHES, BRANCH_STORAGE_KEY, type BranchOption } from '../config';

interface BranchContextValue {
  branches: BranchOption[];
  branchId: string | null;
  branch: BranchOption | null;
  /** True once the user has explicitly chosen a branch. */
  hasSelected: boolean;
  selectBranch: (id: string) => void;
}

const BranchContext = createContext<BranchContextValue | undefined>(undefined);

const readStored = (): string | null => {
  try {
    const id = localStorage.getItem(BRANCH_STORAGE_KEY);
    // Ignore a stored id that's no longer a valid branch.
    return id && BRANCHES.some((b) => b.id === id) ? id : null;
  } catch {
    return null;
  }
};

export function BranchProvider({ children }: { children: ReactNode }) {
  const [branchId, setBranchId] = useState<string | null>(readStored);

  const selectBranch = useCallback((id: string) => {
    if (!BRANCHES.some((b) => b.id === id)) return;
    try {
      localStorage.setItem(BRANCH_STORAGE_KEY, id);
    } catch {
      /* ignore storage errors */
    }
    setBranchId(id);
  }, []);

  const value = useMemo<BranchContextValue>(() => {
    const branch = BRANCHES.find((b) => b.id === branchId) ?? null;
    return {
      branches: BRANCHES,
      branchId,
      branch,
      hasSelected: branch !== null,
      selectBranch,
    };
  }, [branchId, selectBranch]);

  return <BranchContext.Provider value={value}>{children}</BranchContext.Provider>;
}

export function useBranch(): BranchContextValue {
  const ctx = useContext(BranchContext);
  if (!ctx) throw new Error('useBranch must be used within a BranchProvider');
  return ctx;
}
