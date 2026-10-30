import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  getProfile,
  updateProfile,
  resendVerification,
  getSecurity,
  changePassword,
  updateSecurityPrefs,
  revokeSession,
  revokeOtherSessions,
  getBranding,
  updateBranding,
  getPreferences,
  updatePreferences,
} from "../services/settings.service";
import { toast } from "../stores/toastStore";

function useSettingsQuery(key, fn) {
  return useQuery({ queryKey: [key], queryFn: fn });
}

export const useProfile = () => useSettingsQuery("settings-profile", getProfile);
export const useSecurity = () => useSettingsQuery("settings-security", getSecurity);
export const useBranding = () => useSettingsQuery("settings-branding", getBranding);
export const usePreferences = () => useSettingsQuery("settings-preferences", getPreferences);

export function useUpdateProfile() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateProfile,
    onSuccess: (profile) => {
      toast.success(
        profile.emailChanged
          ? "Profile updated. A verification email has been sent to your new address."
          : "Profile updated."
      );
      qc.invalidateQueries({ queryKey: ["settings-profile"] });
    },
    onError: () => toast.error("Couldn't save your profile. Please try again."),
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: resendVerification,
    onSuccess: (r) => toast.success(`Verification email sent to ${r.email}.`),
    onError: () => toast.error("Couldn't send the verification email."),
  });
}

export function useChangePassword() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: changePassword,
    onSuccess: () => {
      toast.success("Password changed.");
      qc.invalidateQueries({ queryKey: ["settings-security"] });
    },
  });
}

export function useUpdateSecurityPrefs() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateSecurityPrefs,
    onSuccess: () => {
      toast.success("Security preferences saved.");
      qc.invalidateQueries({ queryKey: ["settings-security"] });
    },
    onError: () => toast.error("Couldn't save security preferences."),
  });
}

export function useRevokeSession() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeSession,
    onSuccess: () => {
      toast.success("Session revoked.");
      qc.invalidateQueries({ queryKey: ["settings-security"] });
    },
    onError: (e) => toast.error(e.message),
  });
}

export function useRevokeOtherSessions() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: revokeOtherSessions,
    onSuccess: () => {
      toast.success("Signed out of all other sessions.");
      qc.invalidateQueries({ queryKey: ["settings-security"] });
    },
    onError: () => toast.error("Couldn't sign out other sessions."),
  });
}

export function useUpdateBranding() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updateBranding,
    onSuccess: () => {
      toast.success("Studio branding saved.");
      qc.invalidateQueries({ queryKey: ["settings-branding"] });
    },
    onError: () => toast.error("Couldn't save branding. Please try again."),
  });
}

export function useUpdatePreferences() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: updatePreferences,
    onSuccess: () => {
      toast.success("Preferences saved.");
      qc.invalidateQueries({ queryKey: ["settings-preferences"] });
    },
    onError: () => toast.error("Couldn't save preferences. Please try again."),
  });
}