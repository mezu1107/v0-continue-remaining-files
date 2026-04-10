"use client"

import { motion } from "framer-motion"

interface Section {
  id: string
  title: string
  icon: any
}

interface Props {
  sections: Section[]
  content: string
}

export default function TermsContent({ sections, content }: Props) {

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  }

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0 }
  }

  return (

    <section className="py-20 bg-white">

      <div className="container mx-auto px-6 max-w-4xl">

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-16"
        >

          {sections.map((sec) => {

            const Icon = sec.icon

            return (

              <motion.section
                key={sec.id}
                id={sec.id}
                variants={itemVariants}
                className="scroll-mt-28"
              >

                <div className="flex items-center gap-3 mb-6">

                  <Icon className="h-6 w-6 text-indigo-600" />

                  <h2 className="text-2xl font-bold">
                    {sec.title}
                  </h2>

                </div>

                <div
                  className="prose max-w-none"
                  dangerouslySetInnerHTML={{
                    __html: content
                  }}
                />

              </motion.section>

            )
          })}

        </motion.div>

      </div>

    </section>
  )
}