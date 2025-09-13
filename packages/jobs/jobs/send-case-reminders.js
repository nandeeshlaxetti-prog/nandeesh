import { sendCaseReminders } from '../src/case-reminders'

export default async function() {
  await sendCaseReminders()
}
