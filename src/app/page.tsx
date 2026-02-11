'use client';

import { ArchitectureDiagram } from '@/components/ArchitectureDiagram';
import { CodeBlock } from '@/components/CodeBlock';
import { Note } from '@/components/Note';
import { Step, StepContainer } from '@/components/Step';
import { PageHeader } from '@/components/PageHeader';
import { HowItWorksHeaderButtons } from '@/components/HeaderButtons';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const LLM_CONTENT = `# Company Enrichment Pipeline with Exa Answer API

## Overview
Build a complete enrichment pipeline for your CRM or database using the Exa Answer API.

## Pipeline Summary
1. **Initial Backfill**: Query records → Call Exa Answer for each → Get structured data → Update database
2. **Weekly Refresh**: Cron triggers → Re-query all companies → Fresh data from Exa → Push updates to database
3. **New Accounts**: Daily cron queries new accounts → Exa Answer enriches → Auto-sync on ingest

## Exa Answer API
Exa Answer combines web search and LLM extraction in a single API call. Ask a question about any company and get back structured data in your exact schema—no separate LLM step required.

### API Format
\`\`\`javascript
import Exa from 'exa-js';
const exa = new Exa(process.env.EXA_API_KEY);

const response = await exa.answer(
  "What is the company information for Stripe?",
  { schema: companySchema }
);
// response.answer contains structured data
// response.citations contains source URLs
\`\`\`

## Phase 1: Initial Backfill
One-time enrichment of existing company records.

1. Query your database for company names and domains
2. Call Exa Answer with your structured schema for each company
3. Push structured data back to your database

## Phase 2: Weekly Refresh
Scheduled re-enrichment to keep data fresh.

- Set up a cron job (e.g., Monday 6 AM)
- Query accounts prioritized by staleness
- Re-enrich with Exa Answer
- Push updates to database

## Phase 3: New Record Ingestion
Automatically enrich new records as they're added.

- Daily cron detects new records
- Exa Answer enriches each new company
- Auto-sync on ingest

## Getting Started
Sign up for a free API key at https://dashboard.exa.ai
Documentation: https://docs.exa.ai
`;

function VisualizationButton() {
  return (
    <Link href="/visualization">
      <button className="flex items-center gap-2 rounded-lg border border-[#e5e5e5] bg-white px-4 py-2 text-sm font-medium text-black hover:bg-[#f9f7f7] hover:border-[rgba(9,114,213,0.32)] transition-all">
        <ArrowLeft size={16} />
        <span>Visualization</span>
      </button>
    </Link>
  );
}

function HeaderButtons({ llmContent }: { llmContent: string }) {
  return (
    <div className="flex items-center gap-2">
      <HowItWorksHeaderButtons llmContent={llmContent} />
      <VisualizationButton />
    </div>
  );
}

export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      <PageHeader
        title="Company Enrichment Tutorial"
        subtitle="Build a complete enrichment pipeline for your CRM or database using the Exa Answer API."
        rightContent={<HeaderButtons llmContent={LLM_CONTENT} />}
      />

      <main className="pb-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">

          <section className="mb-12">
            <h2 className="text-2xl font-bold text-[#000911] mb-2">Architecture Overview</h2>
            <p className="text-[#60646c] mb-6">
              Watch the complete data flow: your middleware calls Exa Answer to get structured company data, then syncs to your CRM or database.
            </p>
            <ArchitectureDiagram />
          </section>

          <section className="mb-12">
            <h3 className="text-xl font-semibold text-[#000911] mb-4">Pipeline Summary</h3>
            <div className="space-y-4">
              <div>
                <a href="#initial-backfill" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">1. Initial Backfill</a>
                <p className="text-[13px] text-[#60646c]">Query records → Call Exa Answer for each → Get structured data → Update database</p>
              </div>
              <div>
                <a href="#weekly-refresh" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">2. Weekly Refresh</a>
                <p className="text-[13px] text-[#60646c]">Cron triggers → Re-query all companies → Fresh data from Exa → Push updates to database</p>
              </div>
              <div>
                <a href="#new-records" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">3. New Accounts</a>
                <p className="text-[13px] text-[#60646c]">Daily cron queries new accounts → Exa Answer enriches → Auto-sync on ingest</p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#000911] mb-4">Exa Answer API Format</h2>

            <p className="text-[#60646c] text-[15px] mb-6">
              Exa Answer combines web search and LLM extraction in a single API call. Ask a question about any company
              and get back structured data in your exact schema—no separate LLM step required.
            </p>

            <div className="mb-6">
              <Note variant="info" title="Category Search Types">
                Use <code className="bg-blue-100 px-1 rounded">category: "company"</code> for company searches and <code className="bg-blue-100 px-1 rounded">category: "research paper"</code> for research content. Exa's neural search is the best in the world for these use cases.
              </Note>
            </div>

            <CodeBlock
              language="javascript"
              filename="exa-answer-format.js"
              collapsible={true}
              code={`import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

// Define your output schema (JSON Schema format)
const companySchema = {
  type: 'object',
  properties: {
    industry: {
      type: 'string',
      description: 'Company sector (e.g., "Financial Services", "Developer Tools")'
    },
    annualRevenue: {
      type: 'string',
      description: 'Estimated annual revenue or ARR (e.g., "$50M ARR", "$1.2B")'
    },
    employeeCount: {
      type: 'integer',
      description: 'Total number of employees'
    },
    ownership: {
      type: 'string',
      enum: ['Private', 'Public', 'Subsidiary'],
      description: 'Company ownership status'
    },
    latestFunding: {
      type: 'string',
      description: 'Most recent funding round (e.g., "Series C - $150M")'
    },
    linkedinActivity: {
      type: 'string',
      description: 'Recent LinkedIn posts or company announcements'
    },
    description: {
      type: 'string',
      description: 'Brief company description (1-2 sentences)'
    }
  },
  required: ['industry', 'description']
};

// Call Exa Answer with structured output
const response = await exa.answer(
  \`What is the company information for Stripe including their industry,
   revenue, employee count, ownership status, latest funding,
   and recent LinkedIn activity?\`,
  {
    schema: companySchema,
  }
);

// Response contains structured data matching your schema
console.log(response.answer);
// {
//   "industry": "Financial Services",
//   "annualRevenue": "$14.3B revenue",
//   "employeeCount": 8000,
//   "ownership": "Private",
//   "latestFunding": "Series I - $6.5B at $50B valuation",
//   "linkedinActivity": "12 posts this month, hiring across engineering",
//   "description": "Payment infrastructure for the internet"
// }

// Sources are included for transparency
console.log(response.citations);
// ["https://stripe.com/about", "https://techcrunch.com/...", ...]`}
            />
            <div className="mt-4">
              <Note variant="info" title="Schema Tips">
                Use <code className="bg-blue-100 px-1 rounded">required</code> for must-have fields
                and <code className="bg-blue-100 px-1 rounded">enum</code> for fields with fixed options.
                Add <code className="bg-blue-100 px-1 rounded">description</code> to guide extraction.
              </Note>
            </div>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section id="initial-backfill" className="mb-16 scroll-mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#000911]">Phase 1: Initial Backfill</h2>
              <p className="text-[#60646c] text-[14px]">One-time enrichment of your existing company records</p>
            </div>

            <StepContainer>
              <Step number={1} title="Query your company records">
                <p className="mb-4">
                  Query your database to get the company names and domains you want to enrich,
                  along with the record IDs for syncing data back. This example uses a generic CRM, but works with any database.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="backfill.js"
                  code={`// Query all accounts with websites
const result = await crm.query(\`
  SELECT Id, Name, Website FROM Account WHERE Website != null
\`);

const accounts = result.records.map(acc => ({
  id: acc.Id,
  name: acc.Name,
  domain: new URL(acc.Website).hostname,
}));`}
                />
              </Step>

              <Step number={2} title="Enrich with Exa Answer">
                <p className="mb-4">
                  For each company, call Exa Answer with your structured schema. This single API call searches the web
                  and extracts exactly the fields you need—no separate LLM step required.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="enrich-company.js"
                  code={`import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

async function enrichCompany(companyName, domain) {
  const response = await exa.answer(
    \`What is the company information for \${companyName} (\${domain})?\`,
    { schema: companySchema }
  );
  return { data: response.answer, sources: response.citations };
}`}
                />
              </Step>

              <Step number={3} title="Update your database with enriched data">
                <p className="mb-4">
                  Push the structured data back to your database, mapping fields to your schema.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="update-crm.js"
                  code={`async function updateCRMAccount(accountId, enrichedData) {
  await crm.sobjects.Account.update({
    Id: accountId,
    Industry: enrichedData.industry,
    NumberOfEmployees: enrichedData.employeeCount,
    Description: enrichedData.description,
    Last_Enriched__c: new Date().toISOString(),
  });
}`}
                />
              </Step>

              <Step number={4} title="Run the complete backfill pipeline" isLast>
                <p className="mb-4">
                  Orchestrate all the steps with concurrency control and error handling.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="run-backfill.js"
                  code={`// Process accounts with concurrency limit
for (const account of accounts) {
  const { data } = await enrichCompany(account.name, account.domain);
  await updateCRMAccount(account.id, data);
}`}
                />
                <div className="mt-4">
                  <Note variant="success" title="Initial Backfill Complete">
                    Your existing accounts are now enriched with fresh data from the web.
                    Next: set up scheduled refresh to keep data current.
                  </Note>
                </div>
              </Step>
            </StepContainer>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section id="weekly-refresh" className="mb-16 scroll-mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#000911]">Phase 2: Weekly Refresh</h2>
              <p className="text-[#60646c] text-[14px]">Scheduled re-enrichment to keep data fresh</p>
            </div>

            <StepContainer>
              <Step number={1} title="Set up a cron job">
                <p className="mb-4">
                  Schedule a weekly job to trigger the refresh process. Monday morning is a common choice.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="weekly-refresh.js"
                  code={`import cron from 'node-cron';

// Run every Monday at 6 AM
cron.schedule('0 6 * * 1', async () => {
  // Refresh logic here
});`}
                />
              </Step>

              <Step number={2} title="Query accounts prioritized by staleness">
                <p className="mb-4">
                  Fetch accounts from your CRM, ordered by when they were last enriched so the stalest data gets refreshed first.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="query-stale.js"
                  code={`const accounts = await crm.query(
  'SELECT Id, Name, Website FROM Account ORDER BY Last_Enriched__c ASC'
);`}
                />
              </Step>

              <Step number={3} title="Re-enrich with Exa Answer">
                <p className="mb-4">
                  Call Exa Answer for each account to get fresh data from the web.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="re-enrich.js"
                  code={`for (const account of accounts.records) {
  const { data } = await enrichCompany(account.Name, account.Website);
  // data contains fresh structured company info
}`}
                />
              </Step>

              <Step number={4} title="Push updates to your database" isLast>
                <p className="mb-4">
                  Update each record with the fresh enrichment data.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="push-updates.js"
                  code={`await updateCRMAccount(account.Id, data);`}
                />
                <div className="mt-4">
                  <Note variant="success" title="Weekly Refresh Complete">
                    Your accounts stay current with fresh data from the web every week.
                  </Note>
                </div>
              </Step>
            </StepContainer>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section id="new-records" className="mb-16 scroll-mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#000911]">Phase 3: New Record Ingestion</h2>
              <p className="text-[#60646c] text-[14px]">Automatically enrich new records as they're added to your database</p>
            </div>

            <StepContainer>
              <Step number={1} title="Set up a daily cron job">
                <p className="mb-4">
                  Schedule a daily job to detect and enrich new records added in the last 24 hours.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="new-account-cron.js"
                  code={`import cron from 'node-cron';

// Run daily at 7 AM
cron.schedule('0 7 * * *', async () => {
  // New account enrichment logic here
});`}
                />
              </Step>

              <Step number={2} title="Query new records">
                <p className="mb-4">
                  Fetch accounts created today that haven't been enriched yet.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="query-new.js"
                  code={`const newAccounts = await crm.query(
  'SELECT Id, Name, Website FROM Account WHERE CreatedDate = TODAY'
);`}
                />
              </Step>

              <Step number={3} title="Enrich and sync each new record">
                <p className="mb-4">
                  Call Exa Answer for each new account and push the enriched data back.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="enrich-new.js"
                  code={`for (const account of newAccounts.records) {
  const { data } = await enrichCompany(account.Name, account.Website);
  await updateCRMAccount(account.Id, data);
}`}
                />
              </Step>

              <Step number={4} title="Alternative: Real-time webhook" isLast>
                <p className="mb-4">
                  For instant enrichment, set up a webhook that triggers when a new account is created.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="realtime-webhook.js"
                  code={`// Webhook endpoint for real-time enrichment
app.post('/webhook/new-account', async (req, res) => {
  res.status(200).send('OK');
  const { data } = await enrichCompany(req.body.name, req.body.website);
  await updateCRMAccount(req.body.id, data);
});`}
                />
                <div className="mt-4">
                  <Note variant="success" title="New Record Ingestion Complete">
                    New accounts are automatically enriched—no manual intervention needed.
                  </Note>
                </div>
              </Step>
            </StepContainer>
          </section>


          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#000911] mb-4">That's it!</h2>
            <p className="text-[#60646c] text-[15px] max-w-2xl">
              You now have a complete enrichment pipeline: initial backfill for existing records,
              weekly refresh to keep data current, and automatic enrichment for new accounts.
              The Exa Answer API handles all the web search and data extraction in a single call.
            </p>
          </section>

          <div className="mt-8">
            <a
              href="https://dashboard.exa.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-[#0040f0] text-[15px] font-medium hover:underline"
            >
              Get started with Exa for free
              <ArrowRight size={16} />
            </a>
          </div>
        </div>
      </main>
    </div>
  );
}
