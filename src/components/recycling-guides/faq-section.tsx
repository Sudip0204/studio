import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
    {
        question: "Can I recycle pizza boxes?",
        answer: "It depends. If the cardboard is clean and free of grease, yes. If it's soaked with oil, the greasy parts should be torn off and composted or thrown away, while the clean parts can be recycled."
    },
    {
        question: "What do the numbers on plastic containers mean?",
        answer: "The number inside the chasing arrows symbol is a resin identification code. It identifies the type of plastic the item is made from. It does not automatically mean the item is recyclable in your area. Always check with your local recycling program."
    },
    {
        question: "How should I dispose of old medicines?",
        answer: "Do not flush them down the toilet or throw them in the trash. Many pharmacies and police stations offer take-back programs for safe disposal of expired or unwanted medicines."
    },
    {
        question: "Can broken glass be recycled?",
        answer: "Generally, no. Broken glass can be a safety hazard for workers at recycling facilities. Check with your local program; some may accept it if it's placed in a separate, sealed container."
    },
    {
        question: "What happens to my recyclables after collection?",
        answer: "After collection, recyclables are taken to a Material Recovery Facility (MRF) where they are sorted, cleaned, and processed into raw materials. These materials are then sold to manufacturers to create new products."
    }
];

export function FaqSection() {
    return (
        <section className="w-full py-12 md:py-24 lg:py-32 bg-muted">
            <div className="container px-4 md:px-6">
                <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
                    <div className="inline-block rounded-lg bg-background px-3 py-1 text-sm">Common Questions</div>
                    <h2 className="font-headline text-3xl font-bold tracking-tighter sm:text-5xl">
                        Frequently Asked Questions
                    </h2>
                </div>
                <Accordion type="single" collapsible className="w-full max-w-3xl mx-auto">
                    {faqs.map((faq, index) => (
                        <AccordionItem key={index} value={`item-${index}`}>
                            <AccordionTrigger className="text-left font-semibold">{faq.question}</AccordionTrigger>
                            <AccordionContent className="text-muted-foreground">
                                {faq.answer}
                            </AccordionContent>
                        </AccordionItem>
                    ))}
                </Accordion>
            </div>
        </section>
    )
}
