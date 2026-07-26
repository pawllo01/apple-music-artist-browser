import {
  Accordion,
  AccordionContent,
  AccordionPanel,
  AccordionTitle,
} from "flowbite-react";

import { FAQ_DATA } from "./faq-data";

export default function FAQ() {
  return (
    <section className="mx-auto w-full max-w-4xl px-4 py-12">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium tracking-wider">FAQ'S</p>
        <h1 className="text-3xl font-medium">Everything you need to know</h1>
      </div>

      {Object.entries(FAQ_DATA).map(([groupName, faqs]) => (
        <div key={groupName} className="mt-12">
          <h2 className="text-center text-2xl font-medium capitalize">
            {groupName}
          </h2>

          <Accordion collapseAll className="mt-4 bg-gray-50 dark:bg-gray-800">
            {faqs.map((faq, index) => (
              <AccordionPanel key={index}>
                <AccordionTitle>
                  <span className="flex gap-2">
                    <span className="gradient aspect-square h-4.5 translate-y-[2px] rounded" />
                    {faq.question}
                  </span>
                </AccordionTitle>
                <AccordionContent className="text-gray-500 dark:text-gray-400">
                  {faq.answer}
                </AccordionContent>
              </AccordionPanel>
            ))}
          </Accordion>
        </div>
      ))}
    </section>
  );
}
