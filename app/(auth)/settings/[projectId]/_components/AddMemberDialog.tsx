import React, { useState, useEffect } from "react";
import {
  AlertDialog,
  AlertDialogHeader,
  AlertDialogFooter,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogTitle,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import api from "@/util/api";
import { User } from "@/type/user.type";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { X } from "lucide-react";
import Spin from "@/components/common/Spin";
import { API_URL } from "@/const/api.const";

type AddMemberDialogProps = {
  open: boolean;
  onCancel: () => void;
  onConfirm: (selectedUser: User | null) => void;
};

export default function AddMemberDialog({
  open,
  onCancel,
  onConfirm,
}: AddMemberDialogProps) {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [searchResults, setSearchResults] = useState<User[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimeout = 500;

  useEffect(() => {
    if (searchTerm) {
      const handler = setTimeout(() => {
        setIsLoading(true);
        searchMember(searchTerm);
      }, debounceTimeout);

      return () => clearTimeout(handler);
    } else {
      setSearchResults([]);
    }
  }, [searchTerm]);

  const searchMember = async (input: string) => {
    setIsLoading(true);

    try {
      const { metadata }: { metadata: User[] } = await api.get(
        `${API_URL.User.search}/${input}`
      );
      const searchResult = metadata.filter((item) => item.username);
      setSearchResults(searchResult);
    } catch (error) {
      console.error("Search failed:", error);
      setSearchResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputFocus = () => setIsInputFocused(true);
  const handleSelectUser = (user: User) => {
    setSelectedUser(user);
    setSearchTerm(user.name);
    setSearchResults([]);
    setIsInputFocused(false);
  };

  return (
    <AlertDialog open={open}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Select a Member to Add</AlertDialogTitle>
          <AlertDialogDescription>
            {selectedUser ? (
              <Badge className="mt-3">
                <div className="flex gap-1 items-center">
                  <p className="text-sm leading-5">{selectedUser.username}</p>
                  <X size={14} onClick={() => setSelectedUser(null)} />
                </div>
              </Badge>
            ) : (
              <Input
                placeholder="Search member..."
                value={searchTerm}
                onFocus={handleInputFocus}
                onChange={(e) => setSearchTerm(e.currentTarget.value)}
              />
            )}
            {isInputFocused && searchTerm && (
              <div className="bg-trekn-default-default mt-2 py-3 rounded-xl">
                {!isLoading ? (
                  searchResults.map((user) => (
                    <div
                      className="p-2 hover:bg-trekn-default-neutral-secondary"
                      key={user.username}
                      onClick={() => handleSelectUser(user)}
                    >
                      <p className="text-base">{user.username}</p>
                    </div>
                  ))
                ) : (
                  <div className="flex items-center justify-center py-5">
                    <Spin className="fill-white" />
                  </div>
                )}
              </div>
            )}
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={onCancel}>Cancel</AlertDialogCancel>
          <AlertDialogAction onClick={() => onConfirm(selectedUser)}>
            Confirm
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
