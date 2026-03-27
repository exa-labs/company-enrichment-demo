'use client';

import { CodeBlock } from '@/components/CodeBlock';
import { Note } from '@/components/Note';
import { Step, StepContainer } from '@/components/Step';
import { PageHeader } from '@/components/PageHeader';
import { HowItWorksHeaderButtons } from '@/components/HeaderButtons';
import Link from 'next/link';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const LLM_CONTENT = `# Company Enrichment Pipeline with Exa Deep Search

## Overview
Build a complete enrichment pipeline for your CRM or database using Exa Deep Search with structured output.

## Pipeline Summary
1. **Initial Backfill**: Query records → Call Exa Deep Search for each → Get structured data → Update database
2. **Weekly Refresh**: Cron triggers → Re-query all companies → Fresh data from Exa → Push updates to database
3. **New Accounts**: Daily cron queries new accounts → Exa Deep Search enriches → Auto-sync on ingest

## Exa Deep Search
Exa Deep Search performs a thorough web search and returns structured data via outputSchema in a single API call. No separate LLM step required.

### API Format
\`\`\`javascript
import Exa from 'exa-js';
const exa = new Exa(process.env.EXA_API_KEY);

const response = await exa.search(
  "Company profile and information for Stripe",
  {
    type: "deep",
    category: "company",
    outputSchema: companySchema,
  }
);
// response.output.content contains structured data
// response.output.grounding contains source citations
\`\`\`

## Phase 1: Initial Backfill
One-time enrichment of existing company records.

1. Query your database for company names and domains
2. Call Exa Deep Search with your outputSchema for each company
3. Push structured data back to your database

## Phase 2: Weekly Refresh with Exa Monitors
Automated weekly re-enrichment using Exa Monitors.

- Create a Monitor with your outputSchema and a weekly trigger
- Exa runs the search automatically and deduplicates results
- Fresh structured data is delivered to your webhook
- Your webhook handler updates the database

## Phase 3: New Record Ingestion
Automatically enrich new records as they're added.

- Daily cron detects new records
- Exa Deep Search enriches each new company
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
        subtitle="Build a complete enrichment pipeline for your CRM or database using Exa Deep Search with structured output."
        rightContent={<HeaderButtons llmContent={LLM_CONTENT} />}
      />

      <main className="pb-16">
        <div className="mx-auto max-w-5xl px-6 lg:px-8">

          <section className="mb-12">
            <h3 className="text-xl font-semibold text-[#000911] mb-4">Pipeline Summary</h3>
            <div className="space-y-4">
              <div>
                <a href="#initial-backfill" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">1. Initial Backfill</a>
                <p className="text-[13px] text-[#60646c]">Query records → Call Exa Deep Search for each → Get structured data → Update database</p>
              </div>
              <div>
                <a href="#weekly-refresh" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">2. Weekly Refresh with Exa Monitors</a>
                <p className="text-[13px] text-[#60646c]">Exa Monitor fires weekly → Delivers fresh structured data to webhook → Push updates to database</p>
              </div>
              <div>
                <a href="#new-records" className="font-medium text-[#0040f0] text-[14px] hover:underline transition-colors">3. New Accounts</a>
                <p className="text-[13px] text-[#60646c]">Daily cron queries new accounts → Exa Deep Search enriches → Auto-sync on ingest</p>
              </div>
            </div>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section className="mb-16">
            <h2 className="text-2xl font-bold text-[#000911] mb-4">Exa Deep Search API Format</h2>

            <p className="text-[#60646c] text-[15px] mb-6">
              Exa Deep Search performs a thorough web search and returns structured data via <code className="bg-gray-100 px-1 rounded">outputSchema</code> in a single API call.
              Define your JSON Schema and get back exactly the fields you need—no separate LLM step required.
            </p>

            <CodeBlock
              language="javascript"
              filename="exa-deep-search.js"
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
      type: 'string',
      description: 'Approximate number of employees (e.g., "8,000", "~500")'
    },
    ownership: {
      type: 'string',
      description: 'Ownership status: Private, Public, or Subsidiary'
    },
    latestFunding: {
      type: 'string',
      description: 'Most recent funding round (e.g., "Series C - $150M")'
    },
    recentNews: {
      type: 'string',
      description: 'Most notable recent news or announcement'
    },
    description: {
      type: 'string',
      description: 'Brief company description (1-2 sentences)'
    }
  },
  required: ['industry', 'description']
};

// Call Exa Deep Search with structured output
const response = await exa.search(
  'Company profile and information for Stripe',
  {
    type: 'deep',
    category: 'company',
    outputSchema: companySchema,
  }
);

// Parse structured output
const enrichment = JSON.parse(response.output.content);
console.log(enrichment);
// {
//   "industry": "Financial Services",
//   "annualRevenue": "$14.3B revenue",
//   "employeeCount": "8,000",
//   "ownership": "Private",
//   "latestFunding": "Series I - $6.5B at $50B valuation",
//   "recentNews": "Launched Stripe Billing 2.0",
//   "description": "Payment infrastructure for the internet"
// }

// Grounding citations for transparency
const sources = response.output.grounding.flatMap(
  g => g.citations.map(c => c.url)
);
console.log(sources);
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

              <Step number={2} title="Enrich with Exa Deep Search">
                <p className="mb-4">
                  For each company, call Exa Deep Search with your outputSchema. This single API call performs a thorough
                  web search and extracts exactly the fields you need—no separate LLM step required.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="enrich-company.js"
                  code={`import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

async function enrichCompany(companyName, domain) {
  const response = await exa.search(
    \`Company profile and information for \${companyName} (\${domain})\`,
    {
      type: 'deep',
      category: 'company',
      outputSchema: companySchema,
    }
  );
  const enrichment = JSON.parse(response.output.content);
  const sources = response.output.grounding.flatMap(
    g => g.citations.map(c => c.url)
  );
  return { data: enrichment, sources };
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
              <h2 className="text-2xl font-bold text-[#000911]">Phase 2: Weekly Refresh with Exa Monitors</h2>
              <p className="text-[#60646c] text-[14px]">Automated weekly re-enrichment using Exa Monitors — no cron jobs needed</p>
            </div>

            <StepContainer>
              <Step number={1} title="Create a Monitor for each company">
                <p className="mb-4">
                  Use the Monitors API to set up a recurring search with your enrichment schema.
                  Exa handles scheduling, execution, and deduplication automatically.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="create-monitor.js"
                  code={`import Exa from 'exa-js';

const exa = new Exa(process.env.EXA_API_KEY);

const monitor = await exa.monitors.create({
  name: 'Stripe enrichment',
  search: {
    query: 'Company profile and information for Stripe (stripe.com)',
    numResults: 5,
  },
  outputSchema: companySchema,
  trigger: {
    interval: 'weekly',
  },
  webhook: {
    url: 'https://your-app.com/api/enrichment-webhook',
  },
});

// Store the webhook secret — only returned on creation
console.log(monitor.webhookSecret);`}
                />
                <div className="mt-4">
                  <Note variant="info" title="Automatic Deduplication">
                    Each monitor run automatically deduplicates against previous results, so your webhook only receives new or updated information.
                  </Note>
                </div>
              </Step>

              <Step number={2} title="Set up your webhook endpoint">
                <p className="mb-4">
                  Create an endpoint to receive structured enrichment data when the monitor fires.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="enrichment-webhook.js"
                  code={`app.post('/api/enrichment-webhook', async (req, res) => {
  res.status(200).send('OK');

  const { output, metadata } = req.body;

  if (output?.results) {
    for (const result of output.results) {
      const enrichment = JSON.parse(result.output.content);
      const sources = result.output.grounding.flatMap(
        g => g.citations.map(c => c.url)
      );
      await updateCRMAccount(metadata.accountId, enrichment);
    }
  }
});`}
                />
              </Step>

              <Step number={3} title="Create monitors for all accounts">
                <p className="mb-4">
                  Loop through your accounts and create a monitor for each one.
                  Use metadata to link monitor results back to your database records.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="setup-monitors.js"
                  code={`for (const account of accounts) {
  await exa.monitors.create({
    name: \`\${account.name} enrichment\`,
    search: {
      query: \`Company profile and information for \${account.name} (\${account.domain})\`,
      numResults: 5,
    },
    outputSchema: companySchema,
    trigger: { interval: 'weekly' },
    webhook: { url: 'https://your-app.com/api/enrichment-webhook' },
    metadata: { accountId: account.id },
  });
}`}
                />
              </Step>

              <Step number={4} title="Manage your monitors" isLast>
                <p className="mb-4">
                  Pause, update, or trigger monitors on demand as needed.
                </p>
                <CodeBlock
                  language="javascript"
                  filename="manage-monitors.js"
                  code={`// Pause a monitor
await exa.monitors.update(monitor.id, { status: 'paused' });

// Trigger a run immediately (works for active or paused monitors)
await exa.monitors.trigger(monitor.id);

// List all monitors
const monitors = await exa.monitors.list({ status: 'active' });

// Delete a monitor
await exa.monitors.delete(monitor.id);`}
                />
                <div className="mt-4">
                  <Note variant="success" title="Ongoing Monitoring Active">
                    Your accounts stay current automatically — Exa handles the scheduling and delivers fresh data to your webhook.
                  </Note>
                </div>
              </Step>
            </StepContainer>
          </section>

          <hr className="my-12 border-[#e5e5e5]" />

          <section id="new-records" className="mb-16 scroll-mt-8">
            <div className="mb-6">
              <h2 className="text-2xl font-bold text-[#000911]">Phase 3: New Record Ingestion</h2>
              <p className="text-[#60646c] text-[14px]">Automatically enrich new records as they&apos;re added to your database</p>
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
                  Fetch accounts created today that haven&apos;t been enriched yet.
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
                  Call Exa Deep Search for each new account and push the enriched data back.
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
            <h2 className="text-2xl font-bold text-[#000911] mb-4">That&apos;s it!</h2>
            <p className="text-[#60646c] text-[15px] max-w-2xl">
              You now have a complete enrichment pipeline: initial backfill for existing records,
              weekly refresh with Exa Monitors to keep data current, and automatic enrichment for new accounts.
              Exa handles all the web search, scheduling, and data extraction for you.
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
