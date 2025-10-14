export const handleError = (err, context = "") => {
   // eslint-disable-next-line no-undef
   if (process.env.NODE_ENV === "development") {
      console.error(`[Error][${context}]`, err)
   } else { return }
}
