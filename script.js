// Pink Pony Plunge - Site JS
// Mobile nav toggle + smooth scroll + Supabase email capture

// --- Supabase Config ---
const SUPABASE_URL = 'https://axzatrnkesokeqcopifz.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImF4emF0cm5rZXNva2VxY29waWZ6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzYzMTU4MDMsImV4cCI6MjA5MTg5MTgwM30.iQ0uJzXX5HvZ-gBEgBaCdXw85iPhp-juR78kvvhDias';

document.addEventListener('DOMContentLoaded', function () {
    const hamburger = document.getElementById('hamburger');
    const mobileMenu = document.getElementById('mobileMenu');

                            // Toggle mobile menu
                            hamburger.addEventListener('click', function () {
                                  mobileMenu.classList.toggle('open');
                            });

                            // Close mobile menu when a link is clicked
                            mobileMenu.querySelectorAll('a').forEach(function (link) {
                                  link.addEventListener('click', function () {
                                          mobileMenu.classList.remove('open');
                                  });
                            });

                            // Close mobile menu when clicking outside
                            document.addEventListener('click', function (e) {
                                  if (!mobileMenu.contains(e.target) && !hamburger.contains(e.target)) {
                                          mobileMenu.classList.remove('open');
                                  }
                            });

                            // Shrink navbar on scroll
                            var navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function () {
          if (window.scrollY > 50) {
                  navbar.style.boxShadow = '0 2px 10px rgba(0,0,0,0.1)';
          } else {
                  navbar.style.boxShadow = 'none';
          }
    });

                            // --- Email Signup (Supabase) ---
                            var signupForm = document.getElementById('emailSignupForm');
    var signupMessage = document.getElementById('signupMessage');

                            if (signupForm) {
                                  signupForm.addEventListener('submit', async function (e) {
                                          e.preventDefault();

                                                                    var emailInput = document.getElementById('signupEmail');
                                          var email = emailInput.value.trim();
                                          var submitBtn = signupForm.querySelector('button[type="submit"]');

                                                                    if (!email) return;

                                                                    submitBtn.disabled = true;
                                          submitBtn.textContent = 'Sending...';
                                          signupMessage.style.display = 'none';

                                                                    try {
                                                                              var response = await fetch(SUPABASE_URL + '/rest/v1/email_signups', {
                                                                                          method: 'POST',
                                                                                          headers: {
                                                                                                        'Content-Type': 'application/json',
                                                                                                        'apikey': SUPABASE_ANON_KEY,
                                                                                                        'Authorization': 'Bearer ' + SUPABASE_ANON_KEY,
                                                                                                        'Prefer': 'return=minimal'
                                                                                            },
                                                                                          body: JSON.stringify({
                                                                                                        email: email,
                                                                                                        source: 'website_footer',
                                                                                                        signed_up_at: new Date().toISOString()
                                                                                            })
                                                                              });

                                            if (response.ok || response.status === 201) {
                                                        signupMessage.textContent = "You're in! We'll keep you posted.";
                                                        signupMessage.style.color = '#33C4E2';
                                                        signupMessage.style.display = 'block';
                                                        emailInput.value = '';
                                            } else if (response.status === 409) {
                                                        signupMessage.textContent = "You're already on the list!";
                                                        signupMessage.style.color = '#33C4E2';
                                                        signupMessage.style.display = 'block';
                                                        emailInput.value = '';
                                            } else {
                                                        var errorData = await response.json().catch(function() { return {}; });
                                                        if (errorData.code === '23505' || (errorData.message && errorData.message.includes('duplicate'))) {
                                                                      signupMessage.textContent = "You're already on the list!";
                                                                      signupMessage.style.color = '#33C4E2';
                                                        } else {
                                                                      signupMessage.textContent = 'Something went wrong. Try again?';
                                                                      signupMessage.style.color = '#E91E8C';
                                                        }
                                                        signupMessage.style.display = 'block';
                                            }
                                                                    } catch (err) {
                                                                              signupMessage.textContent = 'Connection error. Try again in a sec.';
                                                                              signupMessage.style.color = '#E91E8C';
                                                                              signupMessage.style.display = 'block';
                                                                    }

                                                                    submitBtn.disabled = false;
                                          submitBtn.textContent = 'Subscribe';
                                  });
                            }
});
