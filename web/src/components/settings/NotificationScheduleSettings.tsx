import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { useCallback, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import useSWR from "swr";
import { z } from "zod";

// Major timezone options with proper timezone names
const TIMEZONE_OPTIONS = [
  { value: "UTC", label: "UTC" },
  
  // North America
  { value: "America/New_York", label: "Eastern Time" },
  { value: "America/Chicago", label: "Central Time" },
  { value: "America/Denver", label: "Mountain Time" },
  { value: "America/Los_Angeles", label: "Pacific Time" },
  { value: "America/Anchorage", label: "Alaska Time" },
  { value: "Pacific/Honolulu", label: "Hawaii Time" },
  { value: "America/Toronto", label: "Eastern Time - Canada" },
  { value: "America/Vancouver", label: "Pacific Time - Canada" },
  { value: "America/St_Johns", label: "Newfoundland Time" },
  { value: "America/Mexico_City", label: "Central Time - Mexico" },
  
  // South America
  { value: "America/Sao_Paulo", label: "Brasília Time" },
  { value: "America/Argentina/Buenos_Aires", label: "Argentina Time" },
  { value: "America/Santiago", label: "Chile Time" },
  { value: "America/Bogota", label: "Colombia Time" },
  
  // Europe
  { value: "Europe/London", label: "Greenwich Mean Time" },
  { value: "Europe/Paris", label: "Central European Time" },
  { value: "Europe/Berlin", label: "Central European Time - Germany" },
  { value: "Europe/Rome", label: "Central European Time - Italy" },
  { value: "Europe/Zurich", label: "Central European Time - Switzerland" },
  { value: "Europe/Vienna", label: "Central European Time - Austria" },
  { value: "Europe/Stockholm", label: "Central European Time - Sweden" },
  { value: "Europe/Helsinki", label: "Eastern European Time" },
  { value: "Europe/Copenhagen", label: "Central European Time - Denmark" },
  { value: "Europe/Moscow", label: "Moscow Time" },
  { value: "Europe/Kiev", label: "Eastern European Time - Ukraine" },
  { value: "Europe/Athens", label: "Eastern European Time - Greece" },
  { value: "Europe/Istanbul", label: "Turkey Time" },
  
  // Asia
  { value: "Asia/Tokyo", label: "Japan Standard Time" },
  { value: "Asia/Seoul", label: "Korea Standard Time" },
  { value: "Asia/Shanghai", label: "China Standard Time" },
  { value: "Asia/Hong_Kong", label: "Hong Kong Time" },
  { value: "Asia/Singapore", label: "Singapore Time" },
  { value: "Asia/Bangkok", label: "Indochina Time" },
  { value: "Asia/Jakarta", label: "Western Indonesia Time" },
  { value: "Asia/Manila", label: "Philippines Time" },
  { value: "Asia/Kolkata", label: "India Standard Time" },
  { value: "Asia/Karachi", label: "Pakistan Standard Time" },
  { value: "Asia/Dubai", label: "Gulf Standard Time" },
  { value: "Asia/Tehran", label: "Iran Standard Time" },
  { value: "Asia/Jerusalem", label: "Israel Standard Time" },
  
  // Africa
  { value: "Africa/Cairo", label: "Eastern European Time - Egypt" },
  { value: "Africa/Johannesburg", label: "South Africa Standard Time" },
  { value: "Africa/Lagos", label: "West Africa Time" },
  { value: "Africa/Nairobi", label: "East Africa Time" },
  { value: "Africa/Casablanca", label: "Western European Time - Morocco" },
  
  // Oceania
  { value: "Australia/Sydney", label: "Australian Eastern Time" },
  { value: "Australia/Melbourne", label: "Australian Eastern Time - Victoria" },
  { value: "Australia/Brisbane", label: "Australian Eastern Standard Time" },
  { value: "Australia/Adelaide", label: "Australian Central Time" },
  { value: "Australia/Perth", label: "Australian Western Time" },
  { value: "Pacific/Auckland", label: "New Zealand Time" },
  { value: "Pacific/Fiji", label: "Fiji Time" },
];

const formSchema = z.object({
  enabled: z.boolean(),
  startTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  endTime: z.string().regex(/^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/, "Invalid time format"),
  timezone: z.string(),
});

type FormData = z.infer<typeof formSchema>;

interface NotificationScheduleData {
  enabled: boolean;
  quiet_hours: {
    start: string;
    end: string;
  };
  timezone: string;
}

interface NotificationScheduleSettingsProps {
  username: string;
}

export default function NotificationScheduleSettings({ username }: NotificationScheduleSettingsProps) {
  const { t } = useTranslation(["views/settings"]);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch current schedule
  const { data: scheduleData, mutate: refreshSchedule } = useSWR<NotificationScheduleData>(
    `users/${username}/notification-schedule`,
    {
      revalidateOnFocus: false,
    }
  );

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      enabled: false,
      startTime: "22:00",
      endTime: "08:00", 
      timezone: "UTC",
    },
  });

  // Update form when data loads
  useEffect(() => {
    if (scheduleData) {
      form.reset({
        enabled: scheduleData.enabled,
        startTime: scheduleData.quiet_hours.start,
        endTime: scheduleData.quiet_hours.end,
        timezone: scheduleData.timezone,
      });
    }
  }, [scheduleData, form]);

  const onSubmit = useCallback(async (values: FormData) => {
    setIsLoading(true);
    
    const payload = {
      enabled: values.enabled,
      quiet_hours: {
        start: values.startTime,
        end: values.endTime,
      },
      timezone: values.timezone,
    };

    try {
      const response = await axios.put(`users/${username}/notification-schedule`, payload);
      if (response.status === 200) {
        toast.success(t("notification.schedule.toast.success.saved"), {
          position: "top-center",
        });
        refreshSchedule();
      }
    } catch (error: any) {
      const errorMessage = error.response?.data?.detail || "Failed to save schedule";
      toast.error(errorMessage, {
        position: "top-center",
      });
    } finally {
      setIsLoading(false);
    }
  }, [username, refreshSchedule, t]);

  const watchedValues = form.watch();

  // Generate preview text
  const getPreviewText = useCallback(() => {
    if (!watchedValues.enabled) {
      return t("notification.schedule.preview.disabled");
    }

    const { startTime, endTime, timezone } = watchedValues;
    
    if (startTime <= endTime) {
      return t("notification.schedule.preview.sameDay", {
        start: startTime,
        end: endTime,
        timezone: timezone,
      });
    } else {
      return t("notification.schedule.preview.overnight", {
        start: startTime,
        end: endTime,
        timezone: timezone,
      });
    }
  }, [watchedValues, t]);

  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-lg font-medium">{t("notification.schedule.title")}</h4>
        <p className="text-sm text-muted-foreground">
          {t("notification.schedule.description")}
        </p>
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="enabled"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
                <div className="space-y-0.5">
                  <FormLabel className="text-base">
                    {t("notification.schedule.enableSchedule")}
                  </FormLabel>
                  <FormDescription>
                    {t("notification.schedule.enableDescription")}
                  </FormDescription>
                </div>
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
              </FormItem>
            )}
          />

          {form.watch("enabled") && (
            <>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="startTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("notification.schedule.quietStart")}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="endTime"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>{t("notification.schedule.quietEnd")}</FormLabel>
                      <FormControl>
                        <Input
                          type="time"
                          {...field}
                          className="w-full"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="timezone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{t("notification.schedule.timezone")}</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder={t("notification.schedule.selectTimezone")} />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent className="max-h-60">
                        {TIMEZONE_OPTIONS.map((tz) => (
                          <SelectItem key={tz.value} value={tz.value}>
                            {tz.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormDescription>
                      {t("notification.schedule.timezoneDescription")}
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="rounded-md bg-muted p-3">
                <p className="text-sm">
                  <strong>{t("notification.schedule.preview.title")}:</strong> {getPreviewText()}
                </p>
              </div>
            </>
          )}

          <Button type="submit" disabled={isLoading}>
            {isLoading ? t("button.saving", { ns: "common" }) : t("button.save", { ns: "common" })}
          </Button>
        </form>
      </Form>
    </div>
  );
}