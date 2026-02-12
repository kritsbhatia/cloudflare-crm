export interface Env {
  DB: D1Database;
}

// CORS headers for development
const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
};

// Handle CORS preflight
function handleOptions(request: Request) {
  return new Response(null, {
    headers: corsHeaders,
  });
}

// Helper function to add CORS headers to response
function jsonResponse(data: any, status = 200) {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      'Content-Type': 'application/json',
      ...corsHeaders,
    },
  });
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    const path = url.pathname;
    const method = request.method;

    // Handle CORS preflight
    if (method === 'OPTIONS') {
      return handleOptions(request);
    }

    try {
      // ========== COMPANIES ==========
      
      // Get all companies
      if (path === '/api/companies' && method === 'GET') {
        const { results } = await env.DB.prepare(
          'SELECT * FROM companies ORDER BY created_at DESC'
        ).all();
        return jsonResponse(results);
      }

      // Get single company
      if (path.match(/^\/api\/companies\/\d+$/) && method === 'GET') {
        const id = path.split('/')[3];
        const company = await env.DB.prepare(
          'SELECT * FROM companies WHERE id = ?'
        ).bind(id).first();
        
        if (!company) {
          return jsonResponse({ error: 'Company not found' }, 404);
        }
        return jsonResponse(company);
      }

      // Create company
      if (path === '/api/companies' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO companies (name, website, industry) VALUES (?, ?, ?)'
        ).bind(body.name, body.website || null, body.industry || null).run();
        
        return jsonResponse({ 
          id: result.meta.last_row_id,
          message: 'Company created successfully' 
        }, 201);
      }

      // Update company
      if (path.match(/^\/api\/companies\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json() as any;
        await env.DB.prepare(
          'UPDATE companies SET name = ?, website = ?, industry = ? WHERE id = ?'
        ).bind(body.name, body.website, body.industry, id).run();
        
        return jsonResponse({ message: 'Company updated successfully' });
      }

      // Delete company
      if (path.match(/^\/api\/companies\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM companies WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Company deleted successfully' });
      }

      // ========== CONTACTS ==========
      
      // Get all contacts
      if (path === '/api/contacts' && method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT 
            contacts.*,
            companies.name as company_name
          FROM contacts
          LEFT JOIN companies ON contacts.company_id = companies.id
          ORDER BY contacts.created_at DESC
        `).all();
        return jsonResponse(results);
      }

      // Get single contact with activities
      if (path.match(/^\/api\/contacts\/\d+$/) && method === 'GET') {
        const id = path.split('/')[3];
        
        const contact = await env.DB.prepare(`
          SELECT 
            contacts.*,
            companies.name as company_name
          FROM contacts
          LEFT JOIN companies ON contacts.company_id = companies.id
          WHERE contacts.id = ?
        `).bind(id).first();
        
        if (!contact) {
          return jsonResponse({ error: 'Contact not found' }, 404);
        }

        // Get activities for this contact
        const { results: activities } = await env.DB.prepare(
          'SELECT * FROM activities WHERE contact_id = ? ORDER BY created_at DESC'
        ).bind(id).all();

        return jsonResponse({ ...contact, activities });
      }

      // Create contact
      if (path === '/api/contacts' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO contacts (first_name, last_name, email, phone, company_id) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          body.first_name,
          body.last_name,
          body.email || null,
          body.phone || null,
          body.company_id || null
        ).run();
        
        return jsonResponse({ 
          id: result.meta.last_row_id,
          message: 'Contact created successfully' 
        }, 201);
      }

      // Update contact
      if (path.match(/^\/api\/contacts\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json() as any;
        await env.DB.prepare(
          'UPDATE contacts SET first_name = ?, last_name = ?, email = ?, phone = ?, company_id = ? WHERE id = ?'
        ).bind(
          body.first_name,
          body.last_name,
          body.email,
          body.phone,
          body.company_id,
          id
        ).run();
        
        return jsonResponse({ message: 'Contact updated successfully' });
      }

      // Delete contact
      if (path.match(/^\/api\/contacts\/\d+$/) && method === 'DELETE') {
        const id = path.split('/')[3];
        await env.DB.prepare('DELETE FROM contacts WHERE id = ?').bind(id).run();
        return jsonResponse({ message: 'Contact deleted successfully' });
      }

      // ========== ACTIVITIES ==========
      
      // Get activities for a contact
      if (path.match(/^\/api\/contacts\/\d+\/activities$/) && method === 'GET') {
        const contactId = path.split('/')[3];
        const { results } = await env.DB.prepare(
          'SELECT * FROM activities WHERE contact_id = ? ORDER BY created_at DESC'
        ).bind(contactId).all();
        return jsonResponse(results);
      }

      // Create activity
      if (path === '/api/activities' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO activities (contact_id, type, subject, notes) VALUES (?, ?, ?, ?)'
        ).bind(
          body.contact_id,
          body.type,
          body.subject || null,
          body.notes || null
        ).run();
        
        return jsonResponse({ 
          id: result.meta.last_row_id,
          message: 'Activity created successfully' 
        }, 201);
      }

      // ========== DEALS ==========
      
      // Get all deals
      if (path === '/api/deals' && method === 'GET') {
        const { results } = await env.DB.prepare(`
          SELECT 
            deals.*,
            companies.name as company_name
          FROM deals
          LEFT JOIN companies ON deals.company_id = companies.id
          ORDER BY deals.created_at DESC
        `).all();
        return jsonResponse(results);
      }

      // Create deal
      if (path === '/api/deals' && method === 'POST') {
        const body = await request.json() as any;
        const result = await env.DB.prepare(
          'INSERT INTO deals (company_id, title, value, stage, close_date) VALUES (?, ?, ?, ?, ?)'
        ).bind(
          body.company_id,
          body.title,
          body.value || null,
          body.stage || 'lead',
          body.close_date || null
        ).run();
        
        return jsonResponse({ 
          id: result.meta.last_row_id,
          message: 'Deal created successfully' 
        }, 201);
      }

      // Update deal stage
      if (path.match(/^\/api\/deals\/\d+$/) && method === 'PUT') {
        const id = path.split('/')[3];
        const body = await request.json() as any;
        await env.DB.prepare(
          'UPDATE deals SET title = ?, value = ?, stage = ?, close_date = ? WHERE id = ?'
        ).bind(body.title, body.value, body.stage, body.close_date, id).run();
        
        return jsonResponse({ message: 'Deal updated successfully' });
      }

      // ========== DASHBOARD STATS ==========
      
      if (path === '/api/dashboard' && method === 'GET') {
        const contactCount = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM contacts'
        ).first();
        
        const companyCount = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM companies'
        ).first();
        
        const dealCount = await env.DB.prepare(
          'SELECT COUNT(*) as count FROM deals'
        ).first();
        
        const totalValue = await env.DB.prepare(
          'SELECT SUM(value) as total FROM deals WHERE stage != "closed-lost"'
        ).first();

        return jsonResponse({
          contacts: contactCount?.count || 0,
          companies: companyCount?.count || 0,
          deals: dealCount?.count || 0,
          pipeline_value: totalValue?.total || 0,
        });
      }

      // Default 404
      return jsonResponse({ error: 'Not found' }, 404);

    } catch (error: any) {
      console.error('Error:', error);
      return jsonResponse({ error: error.message || 'Internal server error' }, 500);
    }
  },
};