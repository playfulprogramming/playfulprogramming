import dayjs from "dayjs";

export function formatDiscordCreated(date: Date): string {
    if (dayjs(date).isSame(dayjs(), 'day')) {
        return dayjs(date).format("[Today at] HH:mm A");
    }
    return dayjs(date).format("M/D/YY, HH:mm A");
}