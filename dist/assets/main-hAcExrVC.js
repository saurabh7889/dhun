(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const n of document.querySelectorAll('link[rel="modulepreload"]'))i(n);new MutationObserver(n=>{for(const o of n)if(o.type==="childList")for(const c of o.addedNodes)c.tagName==="LINK"&&c.rel==="modulepreload"&&i(c)}).observe(document,{childList:!0,subtree:!0});function a(n){const o={};return n.integrity&&(o.integrity=n.integrity),n.referrerPolicy&&(o.referrerPolicy=n.referrerPolicy),n.crossOrigin==="use-credentials"?o.credentials="include":n.crossOrigin==="anonymous"?o.credentials="omit":o.credentials="same-origin",o}function i(n){if(n.ep)return;n.ep=!0;const o=a(n);fetch(n.href,o)}})();function ot(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/3600),i=Math.floor(e%3600/60),n=e%60;return a>0?`${a}:${String(i).padStart(2,"0")}:${String(n).padStart(2,"0")}`:`${i}:${String(n).padStart(2,"0")}`}function Ae(t){return isFinite(t)?t>=1e9?(t/1e9).toFixed(1).replace(/\.0$/,"")+"B":t>=1e6?(t/1e6).toFixed(1).replace(/\.0$/,"")+"M":t>=1e3?(t/1e3).toFixed(1).replace(/\.0$/,"")+"K":String(t):"0"}function z(t,e,a){return Math.min(a,Math.max(e,t))}function Me(t,e=300){let a;return(...i)=>{clearTimeout(a),a=setTimeout(()=>t(...i),e)}}const O={get(t,e=null){try{const a=localStorage.getItem(t);return a?JSON.parse(a):e}catch{return e}},set(t,e){try{return localStorage.setItem(t,JSON.stringify(e)),!0}catch{return!1}},remove(t){try{return localStorage.removeItem(t),!0}catch{return!1}}};function Kt(t,e){document.documentElement.style.setProperty(t,e)}function Ce(){const t=document.documentElement,e=t.getAttribute("data-theme"),a=window.matchMedia("(prefers-color-scheme: dark)").matches,n=e==="dark"||!e&&a?"light":"dark";return t.setAttribute("data-theme",n),O.set("dhun-theme",n),n}function Le(){const t=O.get("dhun-theme");t&&document.documentElement.setAttribute("data-theme",t)}window.matchMedia("(prefers-reduced-motion: reduce)").matches;const l=(t,e=document)=>e.querySelector(t),p=(t,e=document)=>Array.from(e.querySelectorAll(t));function r(t,e={},...a){const i=document.createElement(t);return Object.entries(e).forEach(([n,o])=>{n==="class"?i.className=o:n==="style"&&typeof o=="object"?Object.assign(i.style,o):n.startsWith("on")&&typeof o=="function"?i.addEventListener(n.slice(2).toLowerCase(),o):o!=null&&i.setAttribute(n,o)}),a.flat().forEach(n=>{n instanceof Node?i.appendChild(n):n!=null&&i.appendChild(document.createTextNode(String(n)))}),i}function g(t){return String(t).replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/"/g,'"').replace(/'/g,"&#039;")}function dt(t,e={}){const{persistKey:a,storage:i=localStorage}=e;let n={...t};const o=new Set;function c(){if(a){const C=O.get(a);C&&(n={...t,...C})}}function h(){a&&O.set(a,n)}function x(C){return o.add(C),()=>o.delete(C)}function y(){o.forEach(C=>C(n)),h()}function w(){return n}function S(C){return n={...n,...C},y(),n}function P(C,N){const B=C.split("."),Q=B.pop();let V=n;for(const X of B)X in V||(V[X]={}),V=V[X];return V[Q]=N,y(),n}function M(){n={...t},y()}return c(),{get:w,set:S,setPath:P,subscribe:x,reset:M,notify:y}}const $=dt({user:null,token:null,refreshToken:null,isAuthenticated:!1,isLoading:!1,error:null},{persistKey:"dhun-auth"}),s=dt({queue:[],queueIndex:-1,queueContext:"",isPlaying:!1,currentTime:0,duration:0,volume:70,isMuted:!1,shuffle:!1,repeat:0,currentTrack:null,liked:{},history:[],crossfade:0},{persistKey:"dhun-player"}),D=dt({playlists:[],likedSongs:[],followedArtists:[],savedAlbums:[],recentlyPlayed:[]},{persistKey:"dhun-library"}),L=dt({theme:"system",sidebarOpen:!0,nowPlayingOpen:!1,currentView:"home",authModalOpen:!1,authMode:"login",createPlaylistModalOpen:!1,searchQuery:"",searchChips:[],searchResults:null,toasts:[],loading:{},isMobile:window.innerWidth<=860,isTouch:"ontouchstart"in window},{persistKey:"dhun-ui"}),A=dt({tracks:{},albums:{},artists:{},playlists:{},searchCache:{},featuredArtist:null,newAlbums:[],popularTracks:[],charts:{}},{persistKey:"dhun-music-cache"});function Se(){const t=O.get("dhun-theme");t&&L.set({theme:t}),window.addEventListener("storage",a=>{if(a.key==="dhun-auth"){const i=O.get("dhun-auth");i&&$.set(i)}if(a.key==="dhun-player"){const i=O.get("dhun-player");i&&s.set(i)}if(a.key==="dhun-library"){const i=O.get("dhun-library");i&&D.set(i)}if(a.key==="dhun-ui"){const i=O.get("dhun-ui");i&&L.set(i)}});const e=()=>{L.set({isMobile:window.innerWidth<=860})};window.addEventListener("resize",e)}const ne=new Map;let Te=[];function H(t,e){ne.set(t,e)}function E(t){if(t.startsWith("#")&&(t=t.slice(1)),location.hash.slice(1)===t){ht();return}location.hash=t}function Be(t){if(!t)return{name:"landing",params:{}};const[e,...a]=t.split("-"),i=a.join("-");return{name:e,params:{id:i}}}async function ht(){const t=location.hash.slice(1),{name:e,params:a}=Be(t);for(const n of Te){const o=await n({name:e,params:a,hash:t});if(o===!1)return;if(typeof o=="string"){location.hash=o;return}}const i=ne.get(e);i?(L.set({currentView:e}),await i(a)):e!=="landing"&&E("home")}function Pe(){ht(),window.addEventListener("hashchange",ht),window.addEventListener("popstate",ht)}const Ie="",Fe="",qe="";class ze{constructor(){this.baseUrl=Ie,this.supabaseUrl=Fe,this.supabaseKey=qe,this.interceptors=[]}use(e){this.interceptors.push(e)}getAuthHeaders(){const{token:e}=$.get(),a={"Content-Type":"application/json"};return e&&(a.Authorization=`Bearer ${e}`),this.supabaseKey&&(a.apikey=this.supabaseKey),a}async request(e,a={}){const i=e.startsWith("http")?e:`${this.baseUrl}${e}`,n={headers:this.getAuthHeaders(),...a,headers:{...this.getAuthHeaders(),...a.headers}};for(const o of this.interceptors)await o(n);try{const o=await fetch(i,n);if(o.status===401){if(await this.refreshToken())return n.headers=this.getAuthHeaders(),fetch(i,n);throw $.set({user:null,token:null,isAuthenticated:!1,error:"Session expired"}),new Error("Authentication required")}if(!o.ok){const c=await o.json().catch(()=>({message:o.statusText}));throw new Error(c.message||`HTTP ${o.status}`)}return o.status===204?null:o.json()}catch(o){throw o instanceof TypeError&&o.message.includes("fetch")?new Error("Network error. Please check your connection."):o}}async refreshToken(){const{refreshToken:e}=$.get();if(!e||!this.supabaseUrl)return!1;try{const a=await fetch(`${this.supabaseUrl}/auth/v1/token?grant_type=refresh_token`,{method:"POST",headers:{"Content-Type":"application/json",apikey:this.supabaseKey},body:JSON.stringify({refresh_token:e})});if(a.ok){const i=await a.json();return $.set({token:i.access_token,refreshToken:i.refresh_token,user:i.user}),!0}}catch(a){console.error("Token refresh failed:",a)}return!1}get(e,a){const i=a?`${e}?${new URLSearchParams(a).toString()}`:e;return this.request(i,{method:"GET"})}post(e,a){return this.request(e,{method:"POST",body:JSON.stringify(a)})}put(e,a){return this.request(e,{method:"PUT",body:JSON.stringify(a)})}patch(e,a){return this.request(e,{method:"PATCH",body:JSON.stringify(a)})}delete(e){return this.request(e,{method:"DELETE"})}}const k=new ze,at={async signup(t,e,a){var o,c;if(!k.supabaseUrl){const h=JSON.parse(localStorage.getItem("dhun_local_users")||"{}");if(h[t])throw new Error("An account with this email already exists.");const x={id:"usr_"+Math.random().toString(36).slice(2,9),email:t,user_metadata:{display_name:a||t.split("@")[0],name:a||t.split("@")[0]}};h[t]={user:x,password:e},localStorage.setItem("dhun_local_users",JSON.stringify(h));const y="demo_token_"+Date.now();return $.set({user:x,token:y,refreshToken:"demo_refresh_"+Date.now(),isAuthenticated:!0}),{user:x,session:{access_token:y}}}const i=await fetch(`${k.supabaseUrl}/auth/v1/signup`,{method:"POST",headers:{"Content-Type":"application/json",apikey:k.supabaseKey},body:JSON.stringify({email:t,password:e,data:{display_name:a}})}),n=await i.json();if(!i.ok)throw new Error(n.message||"Signup failed");return $.set({user:n.user,token:(o=n.session)==null?void 0:o.access_token,refreshToken:(c=n.session)==null?void 0:c.refresh_token,isAuthenticated:!!n.session}),n},async login(t,e){if(!k.supabaseUrl){const n=JSON.parse(localStorage.getItem("dhun_local_users")||"{}");let o=n[t];if(!o)o={user:{id:"usr_"+Math.random().toString(36).slice(2,9),email:t,user_metadata:{display_name:t.split("@")[0],name:t.split("@")[0]}},password:e},n[t]=o,localStorage.setItem("dhun_local_users",JSON.stringify(n));else if(o.password&&o.password!==e)throw new Error("Invalid password. Please check your credentials.");const c="demo_token_"+Date.now();return $.set({user:o.user,token:c,refreshToken:"demo_refresh_"+Date.now(),isAuthenticated:!0}),{user:o.user,access_token:c}}const a=await fetch(`${k.supabaseUrl}/auth/v1/token?grant_type=password`,{method:"POST",headers:{"Content-Type":"application/json",apikey:k.supabaseKey},body:JSON.stringify({email:t,password:e})}),i=await a.json();if(!a.ok)throw new Error(i.message||"Invalid credentials");return $.set({user:i.user,token:i.access_token,refreshToken:i.refresh_token,isAuthenticated:!0}),i},async loginWithGoogle(){if(!k.supabaseUrl){const a={id:"goog_"+Math.random().toString(36).slice(2,9),email:"listener@dhun.local",user_metadata:{display_name:"Dhun Explorer",avatar_url:""}},i="goog_demo_"+Date.now();return $.set({user:a,token:i,refreshToken:"goog_refresh_"+Date.now(),isAuthenticated:!0}),{user:a,access_token:i}}const t=`${window.location.origin}/auth/callback`,e=`${k.supabaseUrl}/auth/v1/authorize?provider=google&redirect_to=${encodeURIComponent(t)}`;window.location.href=e},async handleOAuthCallback(t){const e=new URLSearchParams(t.slice(1)),a=e.get("access_token"),i=e.get("refresh_token");if(!a)throw new Error("No access token in callback");const n=await fetch(`${k.supabaseUrl}/auth/v1/user`,{headers:{Authorization:`Bearer ${a}`,apikey:k.supabaseKey}}),o=await n.json();if(!n.ok)throw new Error(o.message||"Failed to get user");return $.set({user:o,token:a,refreshToken:i,isAuthenticated:!0}),{user:o,accessToken:a,refreshToken:i}},async logout(){k.supabaseUrl&&$.get().token&&await fetch(`${k.supabaseUrl}/auth/v1/logout`,{method:"POST",headers:k.getAuthHeaders()}).catch(()=>{}),$.set({user:null,token:null,refreshToken:null,isAuthenticated:!1})},async resetPassword(t){if(!k.supabaseUrl)return{message:"Reset email simulated (Demo mode)"};const e=await fetch(`${k.supabaseUrl}/auth/v1/recover`,{method:"POST",headers:{"Content-Type":"application/json",apikey:k.supabaseKey},body:JSON.stringify({email:t})}),a=await e.json();if(!e.ok)throw new Error(a.message||"Failed to send reset email");return a},async updatePassword(t){if(!k.supabaseUrl)throw new Error("Supabase not configured");const e=await fetch(`${k.supabaseUrl}/auth/v1/user`,{method:"PUT",headers:k.getAuthHeaders(),body:JSON.stringify({password:t})}),a=await e.json();if(!e.ok)throw new Error(a.message||"Failed to update password");return a},async getSession(){if(!k.supabaseUrl)return null;const t=await fetch(`${k.supabaseUrl}/auth/v1/user`,{headers:k.getAuthHeaders()});if(t.ok){const e=await t.json();return $.set({user:e,isAuthenticated:!0}),e}return null}},re={play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M7 4.5v15a1 1 0 0 0 1.5.86l12-7.5a1 1 0 0 0 0-1.72l-12-7.5A1 1 0 0 0 7 4.5z"/></svg>',pause:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="5.5" y="4" width="4.5" height="16" rx="1.2"/><rect x="14" y="4" width="4.5" height="16" rx="1.2"/></svg>',next:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5.2v13.6a1 1 0 0 0 1.5.87l9-6.8a1 1 0 0 0 0-1.74l-9-6.8A1 1 0 0 0 6 5.2zM18 5v14" /><rect x="17" y="5" width="2.4" height="14" rx="1"/></svg>',prev:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 5.2v13.6a1 1 0 0 1-1.5.87l-9-6.8a1 1 0 0 1 0-1.74l9-6.8A1 1 0 0 1 18 5.2z"/><rect x="4.6" y="5" width="2.4" height="14" rx="1"/></svg>',shuf:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c1.6 0 2.8-.8 3.8-2M21 7h-3.5c-1.6 0-2.8.8-3.8 2M18.5 4 21.5 7l-3 3M18.5 14l3 3-3 3"/></svg>',rep:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3"/></svg>',rep1:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3M11.5 10.5 13 9.5v5"/></svg>',heart:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.2A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.5 2.5c0 6.2-8.5 11.3-8.5 11.3z"/></svg>',heartOn:'<svg viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.2A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.5 2.5c0 6.2-8.5 11.3-8.5 11.3z"/></svg>',vol:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM16.5 9a4 4 0 0 1 0 6M18.8 6.5a7.5 7.5 0 0 1 0 11"/></svg>',mute:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 9.5v5h3.5L13 19V5L7.5 9.5zM17 9.5l4 5M21 9.5l-4 5"/></svg>',down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 9 6 6 6-6"/></svg>',up:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="m6 15 6-6 6 6"/></svg>',search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="m20 20-3.5-3.5"/></svg>',home:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M3 11 12 3l9 8v9a1 1 0 0 1-1 1h-5v-6H9v6H4a1 1 0 0 1-1-1z" /></svg>',library:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M5 4v16M10 4v16M15.5 5.5l4 14" /></svg>',theme:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="4.2" /><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22M5 5l1.8 1.8M17.2 17.2 19 19M19 5l-1.8 1.8M6.8 17.2 5 19" /></svg>',plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 5v14M5 12h14"/></svg>',close:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M18 6 6 18M6 6l12 12"/></svg>',menu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M4 6h16M4 12h16M4 18h16"/></svg>',chevronRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m9 18 6-6-6-6"/></svg>',chevronLeft:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="m15 18-6-6 6-6"/></svg>',user:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>',settings:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 1 4.6 9a1.65 1.65 0 0 1 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 1-.33 1.82V9a1.65 1.65 0 0 1 1.51-1H9a1.65 1.65 0 0 1 1 1.51 1.65 1.65 0 0 1 1.82.33l.06.06a2 2 0 0 0 2.83 0 2 2 0 0 0 0-2.83l.06-.06a1.65 1.65 0 0 1 1.82-.33H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 1-1.51 1z"/></svg>',clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/></svg>',moon:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>',sun:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="5"/><path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/></svg>',google:'<svg viewBox="0 0 24 24"><path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/><path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/><path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/><path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/></svg>',email:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"/></svg>',phone:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>',lock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>',eye:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>',eyeOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><polyline points="20 6 9 17 4 12"/></svg>',more:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="12" cy="12" r="1.5"/><circle cx="19" cy="12" r="1.5"/><circle cx="5" cy="12" r="1.5"/></svg>',share:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="18" cy="5" r="3"/><circle cx="6" cy="12" r="3"/><circle cx="18" cy="19" r="3"/><path d="M8.59 13.51 16.18 19M8.59 10.49 16.18 5"/></svg>',download:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3"/></svg>',filter:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3"/></svg>',bell:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>',bellOff:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M13.73 21a2 2 0 0 1-3.46 0"/><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><line x1="1" y1="1" x2="23" y2="23"/></svg>',repeat:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M4 11V9a3 3 0 0 1 3-3h12M16 3l3 3-3 3M20 13v2a3 3 0 0 1-3 3H5M8 21l-3-3 3-3"/></svg>',shuffle:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 7h3.5c5 0 6 10 11 10H21M3 17h3.5c1.6 0 2.8-.8 3.8-2M21 7h-3.5c-1.6 0-2.8.8-3.8 2M18.5 4 21.5 7l-3 3M18.5 14l3 3-3 3"/></svg>',forward:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M6 5.2v13.6a1 1 0 0 0 1.5.87l9-6.8a1 1 0 0 0 0-1.74l-9-6.8A1 1 0 0 0 6 5.2zM18 5v14" /><rect x="17" y="5" width="2.4" height="14" rx="1"/></svg>',backward:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M18 5.2v13.6a1 1 0 0 1-1.5.87l-9-6.8a1 1 0 0 1 0-1.74l9-6.8A1 1 0 0 1 18 5.2z"/><rect x="4.6" y="5" width="2.4" height="14" rx="1"/></svg>',vinyl:'<svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="3.4" height="9" rx="1"/><rect x="8.4" y="4" width="3.4" height="14" rx="1"/><rect x="13.8" y="7" width="3.4" height="11" rx="1"/><rect x="19.2" y="11" width="3.4" height="7" rx="1"/></svg>',expand:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/></svg>',shrink:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M3 8V5a2 2 0 0 1 2-2h3m18 0v3m-18 11h3a2 2 0 0 0 2-2v-3M3 16v-3a2 2 0 0 1 2-2h3"/></svg>',music:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 18V5l12-2v13"/><circle cx="6" cy="18" r="3"/><circle cx="18" cy="16" r="3"/></svg>',wave:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"><path d="M2 12a10 10 0 0 1 20 0"/></svg>',refresh:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M23 4v6h-6"/><path d="M1 20v-6h6"/><path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"/></svg>',trash:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>',edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>',copy:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"/><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>',link:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.71"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.71-1.71"/></svg>',arrowRight:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M12 5l7 7-7 7"/></svg>',userPlus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><line x1="19" y1="8" x2="19" y2="14"/><line x1="22" y1="11" x2="16" y2="11"/></svg>',heartPlus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.2A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.5 2.5c0 6.2-8.5 11.3-8.5 11.3z"/><line x1="12" y1="9" x2="12" y2="15"/><line x1="9" y1="12" x2="15" y2="12"/></svg>',list:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',grid:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>',heartOutline:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linejoin="round"><path d="M12 20.5S3.5 15.4 3.5 9.2A4.7 4.7 0 0 1 12 6.7a4.7 4.7 0 0 1 8.5 2.5c0 6.2-8.5 11.3-8.5 11.3z"/></svg>',album:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="4" width="20" height="16" rx="2"/><path d="M8 12h8"/></svg>',artist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M12 14v8M8 20h8"/></svg>',playlist:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><line x1="8" y1="6" x2="21" y2="6"/><line x1="8" y1="12" x2="21" y2="12"/><line x1="8" y1="18" x2="21" y2="18"/><line x1="3" y1="6" x2="3.01" y2="6"/><line x1="3" y1="12" x2="3.01" y2="12"/><line x1="3" y1="18" x2="3.01" y2="18"/></svg>',logout:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>'};function j(t,e="",a={}){const i=document.createElement("button");return i.className=`icon-btn ${e}`,i.innerHTML=re[t],Object.entries(a).forEach(([n,o])=>i.setAttribute(n,o)),i}function d(t){return re[t]||""}let v=null,it=[];function oe(){return v||(v=r("div",{class:"modal-overlay",id:"authModal",role:"dialog","aria-modal":"true","aria-labelledby":"authTitle"},[r("div",{class:"modal"},[r("button",{class:"modal-close","aria-label":"Close",onclick:st},d("close")),r("div",{class:"modal-tabs"},[r("button",{class:"modal-tab active","data-tab":"login",onclick:()=>tt("login")},"Login"),r("button",{class:"modal-tab","data-tab":"signup",onclick:()=>tt("signup")},"Sign Up")]),r("div",{class:"modal-panels"},[r("form",{id:"loginForm",class:"modal-panel active","data-panel":"login"},[r("h2",{id:"authTitle"},"Welcome back"),r("p",{class:"modal-subtitle"},"Sign in to access your library and playlists"),r("button",{type:"button",class:"oauth-btn google",onclick:Vt},[d("google"),"Continue with Google"]),r("div",{class:"divider"},[r("span",{},"or continue with email")]),r("div",{class:"form-group"},[r("label",{for:"loginEmail"},"Email"),r("input",{type:"email",id:"loginEmail",name:"email",required:!0,autocomplete:"email",placeholder:"you@example.com"})]),r("div",{class:"form-group"},[r("label",{for:"loginPassword"},"Password"),r("div",{class:"password-wrapper"},[r("input",{type:"password",id:"loginPassword",name:"password",required:!0,autocomplete:"current-password",placeholder:"••••••••"}),r("button",{type:"button",class:"toggle-password","aria-label":"Show password",onclick:xt},d("eye"))])]),r("div",{class:"form-options"},[r("label",{class:"checkbox-label"},[r("input",{type:"checkbox",name:"remember"}),r("span",{},"Remember me")]),r("a",{href:"#",class:"forgot-link",onclick:t=>{t.preventDefault(),tt("forgot")}},"Forgot password?")]),r("button",{type:"submit",class:"btn accent btn-block"},"Sign In"),r("p",{class:"modal-error",id:"loginError",hidden:!0})]),r("form",{id:"signupForm",class:"modal-panel","data-panel":"signup"},[r("h2",{},"Create your account"),r("p",{class:"modal-subtitle"},"Start building your music library"),r("button",{type:"button",class:"oauth-btn google",onclick:Vt},[d("google"),"Continue with Google"]),r("div",{class:"divider"},[r("span",{},"or sign up with email")]),r("div",{class:"form-group"},[r("label",{for:"signupName"},"Display Name"),r("input",{type:"text",id:"signupName",name:"displayName",required:!0,autocomplete:"name",placeholder:"Your name",maxlength:50})]),r("div",{class:"form-group"},[r("label",{for:"signupEmail"},"Email"),r("input",{type:"email",id:"signupEmail",name:"email",required:!0,autocomplete:"email",placeholder:"you@example.com"})]),r("div",{class:"form-group"},[r("label",{for:"signupPhone"},"Mobile (optional)"),r("input",{type:"tel",id:"signupPhone",name:"phone",autocomplete:"tel",placeholder:"+91 98765 43210"})]),r("div",{class:"form-group"},[r("label",{for:"signupPassword"},"Password"),r("div",{class:"password-wrapper"},[r("input",{type:"password",id:"signupPassword",name:"password",required:!0,autocomplete:"new-password",placeholder:"••••••••",minlength:8}),r("button",{type:"button",class:"toggle-password","aria-label":"Show password",onclick:xt},d("eye"))]),r("p",{class:"form-hint"},"At least 8 characters")]),r("div",{class:"form-group"},[r("label",{for:"signupConfirm"},"Confirm Password"),r("div",{class:"password-wrapper"},[r("input",{type:"password",id:"signupConfirm",name:"confirmPassword",required:!0,autocomplete:"new-password",placeholder:"••••••••"}),r("button",{type:"button",class:"toggle-password","aria-label":"Show password",onclick:xt},d("eye"))])]),r("div",{class:"form-options"},[r("label",{class:"checkbox-label"},[r("input",{type:"checkbox",name:"terms",required:!0}),r("span",{},"I agree to the "),r("a",{href:"#",onclick:t=>{t.preventDefault(),lt("Terms of Service coming soon")}},"Terms of Service"),r("span",{}," and "),r("a",{href:"#",onclick:t=>{t.preventDefault(),lt("Privacy Policy coming soon")}},"Privacy Policy")])]),r("button",{type:"submit",class:"btn accent btn-block"},"Create Account"),r("p",{class:"modal-error",id:"signupError",hidden:!0})]),r("form",{id:"forgotForm",class:"modal-panel","data-panel":"forgot"},[r("h2",{},"Reset password"),r("p",{class:"modal-subtitle"},"Enter your email and we'll send you a reset link"),r("div",{class:"form-group"},[r("label",{for:"forgotEmail"},"Email"),r("input",{type:"email",id:"forgotEmail",name:"email",required:!0,autocomplete:"email",placeholder:"you@example.com"})]),r("button",{type:"submit",class:"btn accent btn-block"},"Send Reset Link"),r("p",{class:"modal-error",id:"forgotError",hidden:!0}),r("button",{type:"button",class:"btn line btn-block",onclick:()=>tt("login")},"Back to Login")])])])]),De(),He(),v)}function De(){if(document.getElementById("authModalStyles"))return;const t=document.createElement("style");t.id="authModalStyles",t.textContent=`
    .modal-overlay {
      position: fixed;
      inset: 0;
      background: rgba(0,0,0,.5);
      backdrop-filter: blur(4px);
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 24px;
      z-index: 100;
      opacity: 0;
      visibility: hidden;
      transition: opacity .2s, visibility .2s;
    }
    .modal-overlay.open {
      opacity: 1;
      visibility: visible;
    }
    .modal {
      background: var(--paper);
      border-radius: 16px;
      padding: 32px;
      width: 100%;
      max-width: 420px;
      box-shadow: 0 24px 48px -24px rgba(0,0,0,.3);
      transform: scale(.95);
      transition: transform .2s;
    }
    .modal-overlay.open .modal {
      transform: scale(1);
    }
    .modal-close {
      position: absolute;
      top: 16px;
      right: 16px;
      width: 32px;
      height: 32px;
      border-radius: 50%;
      display: grid;
      place-items: center;
      border: 1px solid var(--line);
      color: var(--ink-2);
    }
    .modal-close:hover {
      background: color-mix(in srgb, var(--ink) 5%, transparent);
      color: var(--ink);
    }
    .modal-close svg { width: 18px; height: 18px; }
    .modal-tabs {
      display: flex;
      gap: 8px;
      margin-bottom: 24px;
      border-bottom: 1px solid var(--line);
      padding-bottom: 8px;
    }
    .modal-tab {
      flex: 1;
      padding: 10px 16px;
      font-weight: 600;
      font-size: 15px;
      color: var(--ink-2);
      border-radius: 8px;
      border: 0;
      background: none;
    }
    .modal-tab:hover { color: var(--ink); }
    .modal-tab.active { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
    .modal-panels { position: relative; }
    .modal-panel { display: none; }
    .modal-panel.active { display: block; animation: fadeIn .2s; }
    @keyframes fadeIn { from { opacity: 0; transform: translateY(4px); } to { opacity: 1; transform: none; } }
    .modal h2 { margin: 0 0 4px; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: 24px; line-height: 1.2; }
    .modal-subtitle { margin: 0 0 24px; color: var(--ink-2); font-size: 15px; }
    .oauth-btn {
      display: flex;
      align-items: center;
      justify-content: center;
      gap: 10px;
      width: 100%;
      padding: 12px 16px;
      border: 1px solid var(--line);
      border-radius: 10px;
      font-weight: 600;
      font-size: 15px;
      color: var(--ink);
      background: var(--paper);
      margin-bottom: 16px;
      transition: background .15s, border-color .15s;
    }
    .oauth-btn:hover { background: color-mix(in srgb, var(--ink) 5%, transparent); border-color: var(--ink-2); }
    .oauth-btn svg { width: 20px; height: 20px; }
    .divider { display: flex; align-items: center; gap: 12px; margin: 8px 0 20px; color: var(--ink-2); font-size: 13px; }
    .divider::before, .divider::after { content: ''; flex: 1; height: 1px; background: var(--line); }
    .form-group { margin-bottom: 16px; }
    .form-group label { display: block; margin-bottom: 6px; font-size: 13px; font-weight: 500; color: var(--ink); }
    .form-group input { width: 100%; padding: 12px 14px; border: 1px solid var(--line); border-radius: 10px; background: var(--paper); color: var(--ink); font-size: 15px; transition: border-color .15s, box-shadow .15s; }
    .form-group input:focus { outline: none; border-color: var(--accent); box-shadow: 0 0 0 3px color-mix(in srgb, var(--accent) 20%, transparent); }
    .form-group input::placeholder { color: var(--ink-2); opacity: .5; }
    .form-hint { margin: 6px 0 0; font-size: 12px; color: var(--ink-2); }
    .password-wrapper { position: relative; }
    .toggle-password { position: absolute; right: 12px; top: 50%; transform: translateY(-50%); width: 32px; height: 32px; display: grid; place-items: center; color: var(--ink-2); border-radius: 8px; }
    .toggle-password:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .toggle-password svg { width: 18px; height: 18px; }
    .form-options { display: flex; align-items: center; justify-content: space-between; margin: 8px 0 20px; font-size: 13px; flex-wrap: wrap; gap: 8px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--ink-2); }
    .checkbox-label input { width: 18px; height: 18px; accent-color: var(--accent); }
    .forgot-link { color: var(--accent); text-decoration: none; }
    .forgot-link:hover { text-decoration: underline; }
    .btn-block { width: 100%; justify-content: center; }
    .modal-error { margin: 12px 0 0; padding: 10px 12px; background: color-mix(in srgb, var(--accent) 15%, transparent); border: 1px solid var(--accent); border-radius: 8px; color: var(--accent); font-size: 13px; display: none; }
    .modal-error:not([hidden]) { display: block; }
    @media (max-width: 480px) {
      .modal { padding: 24px 20px; margin: 16px; }
      .modal-tabs { gap: 4px; }
      .modal-tab { padding: 8px 12px; font-size: 14px; }
    }
  `,document.head.appendChild(t)}function He(){const t=l("#loginForm",v),e=l("#signupForm",v),a=l("#forgotForm",v);t&&it.push(nt(t,"submit",je)),e&&it.push(nt(e,"submit",Ne)),a&&it.push(nt(a,"submit",Re)),it.push(nt(v,"click",i=>{i.target===v&&st()})),it.push(nt(document,"keydown",i=>{i.key==="Escape"&&v.classList.contains("open")&&st()}))}function nt(t,e,a){return t.addEventListener(e,a),()=>t.removeEventListener(e,a)}function tt(t){p(".modal-tab",v).forEach(e=>e.classList.toggle("active",e.dataset.tab===t)),p(".modal-panel",v).forEach(e=>e.classList.toggle("active",e.dataset.panel===t)),p(".modal-error",v).forEach(e=>e.hidden=!0),L.set({authMode:t})}function xt(t){const e=t.currentTarget,a=e.previousElementSibling,i=a.type==="password";a.type=i?"text":"password",e.innerHTML=d(i?"eyeOff":"eye")}async function Vt(){try{W(!0),await at.loginWithGoogle()}catch(t){U("loginError",t.message)}finally{W(!1)}}async function je(t){t.preventDefault();const e=t.target,a=e.email.value.trim(),i=e.password.value;if(!a||!i)return U("loginError","Please fill all fields");try{W(!0,"loginForm"),Dt("loginError"),await at.login(a,i),st(),lt("Welcome back!"),e.reset()}catch(n){U("loginError",n.message)}finally{W(!1,"loginForm")}}async function Ne(t){t.preventDefault();const e=t.target,a=e.displayName.value.trim(),i=e.email.value.trim(),n=e.password.value,o=e.confirmPassword.value;if(!a||!i||!n)return U("signupError","Please fill all required fields");if(n.length<8)return U("signupError","Password must be at least 8 characters");if(n!==o)return U("signupError","Passwords do not match");try{W(!0,"signupForm"),Dt("signupError"),await at.signup(i,n,a),st(),lt("Account created! Welcome to DHUN."),e.reset()}catch(c){U("signupError",c.message)}finally{W(!1,"signupForm")}}async function Re(t){t.preventDefault();const e=t.target,a=e.email.value.trim();if(!a)return U("forgotError","Please enter your email");try{W(!0,"forgotForm"),Dt("forgotError"),await at.resetPassword(a),lt("Reset link sent! Check your email."),tt("login"),e.reset()}catch(i){U("forgotError",i.message)}finally{W(!1,"forgotForm")}}function J(t="login"){v||oe(),document.body.appendChild(v),v.offsetHeight,v.classList.add("open"),tt(t),document.body.style.overflow="hidden",setTimeout(()=>{const e=v.querySelector('input:not([type="hidden"])');e&&e.focus()},100)}function st(){v&&(v.classList.remove("open"),setTimeout(()=>{v.parentNode&&v.parentNode.removeChild(v)},200),document.body.style.overflow="",p(".modal-error",v).forEach(t=>t.hidden=!0))}function U(t,e){const a=l(`#${t}`,v);a&&(a.textContent=e,a.hidden=!1)}function Dt(t){const e=l(`#${t}`,v);e&&(e.hidden=!0)}function W(t,e=null){(e?[l(e,v)]:p("form",v)).forEach(i=>{if(!i)return;const n=l('button[type="submit"]',i);n&&(n.disabled=t,n.textContent=t?"Please wait...":n.dataset.originalText||"Submit",t||(n.dataset.originalText=n.textContent)),p("input, button",i).forEach(o=>o.disabled=t)})}function lt(t,e="info"){const a=r("div",{class:`toast toast-${e}`},t);document.body.appendChild(a),a.offsetHeight,a.classList.add("show"),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),200)},3e3)}if(!document.getElementById("toastStyles")){const t=document.createElement("style");t.id="toastStyles",t.textContent=`
    .toast {
      position: fixed;
      bottom: 100px;
      left: 50%;
      transform: translateX(-50%) translateY(100px);
      padding: 12px 24px;
      background: var(--ink);
      color: var(--paper);
      border-radius: 999px;
      font-weight: 500;
      font-size: 14px;
      z-index: 200;
      opacity: 0;
      transition: transform .3s, opacity .3s;
      box-shadow: 0 12px 24px -12px rgba(0,0,0,.3);
    }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .toast-success { background: #2E7D32; }
    .toast-error { background: var(--accent); }
    @media (max-width: 480px) {
      .toast { left: 16px; right: 16px; transform: none; bottom: 90px; text-align: center; }
      .toast.show { transform: translateY(0); }
    }
  `,document.head.appendChild(t)}let f=null,I=null,Et=null,$t=null,Ht=!1;function Oe(t){return f||(f=r("div",{class:"player",id:"player",role:"region","aria-label":"Music player"},[r("button",{class:"pl-l",id:"plOpen","aria-label":"Open now playing"},[r("div",{class:"art cover",id:"plArt","aria-hidden":"true"}),r("div",{class:"txt"},[r("b",{id:"plT"},"Nothing playing"),r("span",{id:"plA"},"Pick a song to start")])]),r("div",{class:"pl-c"},[r("div",{class:"ctrls"},[j("shuf","",{id:"bShuf","aria-label":"Shuffle",title:"Shuffle"}),j("prev","",{id:"bPrev","aria-label":"Previous",title:"Previous"}),r("button",{class:"play",id:"bPlay","aria-label":"Play"},d("play")),j("next","",{id:"bNext","aria-label":"Next",title:"Next"}),j("rep","",{id:"bRep","aria-label":"Repeat",title:"Repeat"})]),r("div",{class:"bar"},[r("span",{id:"tCur",class:"mono"},"0:00"),r("div",{class:"rail",id:"rail",role:"slider","aria-label":"Seek","aria-valuemin":"0","aria-valuemax":"100","aria-valuenow":"0",tabindex:"0"},[r("div",{class:"fill",id:"railFill"}),r("div",{class:"dot",id:"railDot"})]),r("span",{id:"tDur",class:"mono"},"0:00")])]),r("div",{class:"pl-r"},[j("heart","",{id:"bLike","aria-label":"Like",title:"Like"}),j("vol","",{id:"bMute","aria-label":"Mute",title:"Mute"}),r("input",{class:"vol",id:"vol",type:"range",min:"0",max:"100",value:"70","aria-label":"Volume"}),j("expand","",{id:"bExpand","aria-label":"Open now playing",title:"Open Now Playing"})])]),t&&t.appendChild(f),I=l("#rail",f),Et=l("#railFill",f),$t=l("#railDot",f),Ue(),Ke(),s.subscribe(_t),L.subscribe(_e),_t(s.get()),f)}function Ue(){if(document.getElementById("playerBarStyles"))return;const t=document.createElement("style");t.id="playerBarStyles",t.textContent=`
    .player {
      grid-row: 2;
      grid-column: 1 / -1;
      border-top: 1px solid var(--line);
      display: grid;
      grid-template-columns: 1fr minmax(0, 1.4fr) 1fr;
      align-items: center;
      gap: 20px;
      padding: 0 max(24px, env(safe-area-inset-right, 0px)) 0 24px;
      background: var(--paper);
      position: relative;
      z-index: 5;
    }
    .player.nothing .pl-l { opacity: .6; pointer-events: none; }
    .pl-l { display: flex; align-items: center; gap: 14px; min-width: 0; text-align: left; }
    .pl-l .art { width: 56px; height: 56px; border-radius: 8px; flex: none; }
    .pl-l b { display: block; font-weight: 650; font-size: 15px; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .pl-l span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .pl-l .txt { min-width: 0; }
    .pl-c { display: flex; flex-direction: column; gap: 8px; align-items: center; }
    .ctrls { display: flex; align-items: center; gap: 14px; }
    .ctl { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .ctl:hover { color: var(--ink); }
    .ctl svg { width: 20px; height: 20px; }
    .ctl.on { color: var(--accent); }
    .play { width: 46px; height: 46px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; transition: transform .15s; }
    .play:active { transform: scale(.94); }
    .play svg { width: 20px; height: 20px; }
    .bar { display: flex; align-items: center; gap: 12px; width: 100%; font-family: var(--mono); font-size: 11px; color: var(--ink-2); }
    .rail { position: relative; flex: 1; height: 18px; cursor: pointer; touch-action: none; }
    .rail::before { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: var(--line); border-radius: 2px; }
    .rail .fill { position: absolute; left: 0; top: 8px; height: 2px; background: var(--accent); border-radius: 2px; }
    .rail .dot { position: absolute; top: 4px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper); opacity: 0; transition: opacity .15s; }
    .rail:hover .dot, .rail:focus .dot { opacity: 1; }
    .rail:focus { outline: none; }
    .rail:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }
    .pl-r { display: flex; justify-content: flex-end; align-items: center; gap: 8px; }
    .vol { width: 90px; accent-color: var(--accent); }
    .nothing { opacity: .6; }

    /* Mobile player */
    @media (max-width: 860px) {
      .player {
        position: fixed;
        left: max(10px, env(safe-area-inset-left, 0px));
        right: max(10px, env(safe-area-inset-right, 0px));
        bottom: calc(64px + env(safe-area-inset-bottom, 0px));
        grid-template-columns: 1fr auto;
        border: 0;
        border-radius: 999px;
        background: #0F0F12;
        color: #F2F0EA;
        padding: 8px 10px 8px 8px;
        height: auto;
        gap: 10px;
        box-shadow: 0 18px 40px -14px rgba(0, 0, 0, .55);
        overflow: hidden;
        z-index: 40;
      }
      .player .pl-c .ctrls .ctl,
      .player .pl-r,
      .player .bar span { display: none; }
      .player .pl-c { flex-direction: row; }
      .player .pl-c .bar { position: absolute; left: 0; right: 0; bottom: 0; padding: 0; }
      .player .pl-c .bar .rail { height: 3px; }
      .player .rail::before { top: 0; height: 3px; background: rgba(255, 255, 255, .18); }
      .player .rail .fill { top: 0; height: 3px; }
      .player .rail .dot { display: none; }
      .player .pl-l span { color: #A9A7A2; }
      .player .play { background: #F2F0EA; color: #0F0F12; width: 42px; height: 42px; }
      .player .pl-c .ctrls { gap: 0; }
      .player .pl-c .ctrls .play { display: grid; }
    }
  `,document.head.appendChild(t)}function Ke(){l("#bPlay",f).addEventListener("click",We),l("#bNext",f).addEventListener("click",Ge),l("#bPrev",f).addEventListener("click",Ye),l("#bShuf",f).addEventListener("click",Je),l("#bRep",f).addEventListener("click",Qe),l("#bLike",f).addEventListener("click",Xe),l("#bMute",f).addEventListener("click",Ze),l("#vol",f).addEventListener("input",ta),l("#plOpen",f).addEventListener("click",Wt),l("#bExpand",f).addEventListener("click",Wt),I.addEventListener("pointerdown",ea),I.addEventListener("keydown",aa)}function _t(t){var X;const{queue:e,queueIndex:a,isPlaying:i,currentTime:n,duration:o,volume:c,isMuted:h,shuffle:x,repeat:y,liked:w,currentTrack:S}=t,P=l("#bPlay",f);P&&(P.innerHTML=d(i?"pause":"play"),P.setAttribute("aria-label",i?"Pause":"Play")),l("#bShuf",f).classList.toggle("on",x);const M=l("#bRep",f);M.classList.toggle("on",y>0),M.innerHTML=d(y===2?"rep1":"rep"),l("#bMute",f).innerHTML=d(h||c===0?"mute":"vol"),l("#vol",f).value=c;const C=typeof e[a]=="string"?e[a]:(X=e[a])==null?void 0:X.id,N=A?A.get():{tracks:{}},B=S||(C&&N.tracks?N.tracks[C]:null),Q=B&&w[B.id],V=l("#bLike",f);V.classList.toggle("on",!!Q),V.innerHTML=d(Q?"heartOn":"heart"),B?(l("#plArt",f).style.backgroundImage=B.art||"",l("#plT",f).textContent=B.title||"Unknown",l("#plA",f).textContent=B.artist||"Unknown Artist",l("#tDur",f).textContent=ot(B.duration||o),f.classList.remove("nothing")):(l("#plArt",f).style.backgroundImage="",l("#plT",f).textContent="Nothing playing",l("#plA",f).textContent="Pick a song to start",l("#tDur",f).textContent="0:00",f.classList.add("nothing")),Ve(n,o)}function Ve(t,e){const a=e>0?z(t/e,0,1):0;Et&&(Et.style.width=`${a*100}%`),$t&&($t.style.left=`${a*100}%`),I&&I.setAttribute("aria-valuenow",Math.round(a*100)),l("#tCur",f).textContent=ot(t)}function _e(t){}function We(){const{isPlaying:t,queue:e,queueIndex:a}=s.get();if(!e.length||a===-1){const i=["t0-0","t1-0","t5-0","t3-1","t4-0","t2-1","t0-3","t6-1"];s.set({queue:i,queueIndex:0,queueContext:"Popular on DHUN",currentTime:0,isPlaying:!0});return}s.set({isPlaying:!t})}function Ge(){const{queue:t,queueIndex:e,shuffle:a,repeat:i}=s.get();if(!t.length)return;let n=e;if(a&&t.length>1)do n=Math.floor(Math.random()*t.length);while(n===e&&t.length>1);else if(e<t.length-1)n++;else if(i===1)n=0;else{s.set({isPlaying:!1,currentTime:0});return}s.set({queueIndex:n,currentTime:0,isPlaying:!0})}function Ye(){const{queue:t,queueIndex:e,currentTime:a}=s.get();t.length&&(a>3?s.set({currentTime:0}):e>0?s.set({queueIndex:e-1,currentTime:0}):s.set({queueIndex:t.length-1,currentTime:0}))}function Je(){const{shuffle:t}=s.get();s.set({shuffle:!t})}function Qe(){const{repeat:t}=s.get();s.set({repeat:(t+1)%3})}function Xe(){const{queue:t,queueIndex:e,liked:a}=s.get();if(e<0||e>=t.length)return;const i=t[e],n={...a};n[i]?delete n[i]:n[i]=!0,s.set({liked:n})}function Ze(){const{isMuted:t,volume:e}=s.get();s.set({isMuted:!t})}function ta(t){const e=parseInt(t.target.value,10);s.set({volume:e,isMuted:e===0})}function Wt(){const{queue:t,queueIndex:e}=s.get();t.length&&e>=0&&(window.location.hash="playing")}function ea(t){t.button===0&&(Ht=!0,I.setPointerCapture(t.pointerId),le(t),I.addEventListener("pointermove",se),I.addEventListener("pointerup",ft),I.addEventListener("pointercancel",ft))}function se(t){Ht&&le(t)}function ft(t){Ht=!1,I.releasePointerCapture(t.pointerId),I.removeEventListener("pointermove",se),I.removeEventListener("pointerup",ft),I.removeEventListener("pointercancel",ft)}function le(t){const{duration:e}=s.get();if(!e)return;const a=I.getBoundingClientRect(),i=z((t.clientX-a.left)/a.width,0,1);s.set({currentTime:i*e})}function aa(t){const{currentTime:e,duration:a}=s.get();if(!a)return;let i=e/a;if(t.key==="ArrowLeft")i=z(i-.01,0,1);else if(t.key==="ArrowRight")i=z(i+.01,0,1);else if(t.key==="Home")i=0;else if(t.key==="End")i=1;else return;t.preventDefault(),s.set({currentTime:i*a})}let m=null,T=null,F=null,At=null,Mt=null,ce=null,jt=!1,Nt=!1;function de(t){return m||(m=r("section",{class:"np",id:"np",hidden:!0,role:"dialog","aria-modal":"true","aria-label":"Now Playing"},[r("div",{class:"np-bg","aria-hidden":"true"},[r("i",{}),r("i",{})]),r("div",{class:"np-top"},[j("down","",{id:"npClose","aria-label":"Close now playing"}),r("span",{class:"from",id:"npFrom"},"Playing from DHUN"),j("theme","",{"data-theme-toggle":!0,"aria-label":"Switch theme"})]),r("div",{class:"np-in"},[r("div",{class:"disc",id:"disc"},[r("div",{class:"vwrap"},[r("div",{class:"vinyl spinning",id:"nvinyl"},[r("div",{class:"label cover",id:"nLabel",style:"inset:30%;box-shadow:0 0 0 6px rgba(255,255,255,.06)"})]),r("div",{class:"sheen"})]),r("svg",{class:"ring",viewBox:"0 0 100 100",id:"nring",style:"cursor:pointer;touch-action:none",role:"slider","aria-label":"Seek","aria-valuemin":"0","aria-valuemax":"100","aria-valuenow":"0",tabindex:"0"},[r("circle",{class:"trk",cx:"50",cy:"50",r:"50"}),r("circle",{class:"arc",cx:"50",cy:"50",r:"50",pathLength:"100",transform:"rotate(-90 50 50)","stroke-dasharray":"0 100"}),r("circle",{class:"knob",r:"1.7"})])]),r("div",{class:"np-info"},[r("h2",{id:"nT"},"Track Title"),r("p",{class:"ar"},[r("button",{id:"nA"},"Artist Name"),r("span",{id:"nAl"}," · Album Name")]),r("div",{class:"bar"},[r("span",{id:"nCur",class:"mono"},"0:00"),r("div",{class:"rail",id:"nrail"},[r("div",{class:"fill",id:"nrailFill"}),r("div",{class:"dot",id:"nrailDot"})]),r("span",{id:"nDur",class:"mono"},"0:00")]),r("div",{class:"ctrls",id:"nCtrls"})]),r("aside",{class:"np-q"},[r("h4",{},"Up next"),r("div",{class:"list",id:"nQ"})])])]),t&&t.appendChild(m),T=l("#nring",m),F=l("#nrail",m),At=l("#nrailFill",m),Mt=l("#nrailDot",m),ce=l("#nvinyl",m),ia(),na(),s.subscribe(Gt),L.subscribe(Gt),m)}function ia(){if(document.getElementById("nowPlayingStyles"))return;const t=document.createElement("style");t.id="nowPlayingStyles",t.textContent=`
    .np {
      position: fixed;
      inset: 0;
      z-index: 50;
      background: var(--paper);
      overflow: auto;
      padding-top: env(safe-area-inset-top, 0px);
    }
    .np[hidden] { display: none; }
    .np-bg { position: fixed; inset: 0; pointer-events: none; overflow: hidden; }
    .np-bg i {
      position: absolute;
      border-radius: 50%;
      filter: blur(90px);
      opacity: .55;
      transition: background .8s;
    }
    .np-bg i:nth-child(1) {
      width: 60vmax; height: 60vmax; left: -15vmax; top: -20vmax; background: var(--glow);
    }
    .np-bg i:nth-child(2) {
      width: 50vmax; height: 50vmax; right: -20vmax; bottom: -25vmax; background: var(--glow2, var(--glow));
    }
    .np-in {
      position: relative;
      min-height: 100svh;
      display: grid;
      grid-template-columns: minmax(0, 1.15fr) minmax(0, 1fr) minmax(0, .7fr);
      align-items: center;
      gap: 3vw;
      padding: 70px max(28px, env(safe-area-inset-right, 0px)) 40px var(--gut);
    }
    .np-top {
      position: absolute;
      top: 18px;
      left: var(--gut);
      right: max(20px, env(safe-area-inset-right, 0px));
      display: flex;
      justify-content: space-between;
      align-items: center;
      z-index: 3;
    }
    .np-top .from { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .disc { --S: min(78svh, 44vw); position: relative; width: var(--S); height: var(--S); margin-left: calc(var(--S)*-.3); justify-self: start; }
    .np-info { min-width: 0; }
    .np-info h2 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .86; font-size: clamp(46px, 7vw, 112px); overflow-wrap: anywhere; }
    .np-info .ar { margin: 16px 0 24px; font-family: var(--mono); font-size: 13px; text-transform: uppercase; }
    .np-info .ar button { text-decoration: underline; text-underline-offset: 4px; color: inherit; }
    .np-info .ar span { color: var(--ink-2); }
    .np-info .bar { margin: 16px 0 8px; }
    .np-info .ctrls { justify-content: flex-start; gap: 16px; }
    .np-q h4 { margin: 0 0 10px; font-family: var(--mono); font-weight: 400; font-size: 12px; color: var(--accent); }
    .np-q .trow { grid-template-columns: 40px 1fr auto; gap: 12px; padding: 7px 6px; }
    .np-q .trow .art { width: 40px; height: 40px; }
    .np-q .trow .n, .np-q .trow .lk { display: none; }

    /* Vinyl */
    .vwrap { position: absolute; inset: 0; }
    .vinyl { position: absolute; inset: 0; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, #0b0b0c 0 2px, #151517 2px 3px), #0b0b0c; will-change: transform; }
    .sheen { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: conic-gradient(from 25deg, transparent 0 16%, rgba(255,255,255,.13) 23%, transparent 31% 66%, rgba(255,255,255,.09) 73%, transparent 81%); }
    .label { position: absolute; inset: 30%; border-radius: 50%; display: grid; place-items: center; box-shadow: 0 0 0 6px rgba(255,255,255,.06); }
    .label svg { width: 34%; height: 34%; color: var(--accent); }
    .spinning { animation: spin 9s linear infinite; }
    .paused .spinning { animation-play-state: paused; }
    @keyframes spin { to { transform: rotate(360deg); } }

    /* Progress ring */
    .ring { position: absolute; inset: -2.4%; width: 104.8%; height: 104.8%; overflow: visible; }
    .ring .trk { fill: none; stroke: var(--line); stroke-width: .35; }
    .ring .arc { fill: none; stroke: var(--accent); stroke-width: .5; stroke-linecap: round; }
    .ring .knob { fill: var(--accent); stroke: var(--paper); stroke-width: .9; }

    /* Progress rail */
    .np-info .bar { display: flex; align-items: center; gap: 12px; width: 100%; font-family: var(--mono); font-size: 11px; color: var(--ink-2); }
    .np-info .rail { position: relative; flex: 1; height: 18px; cursor: pointer; touch-action: none; }
    .np-info .rail::before { content: ""; position: absolute; left: 0; right: 0; top: 8px; height: 2px; background: var(--line); border-radius: 2px; }
    .np-info .rail .fill { position: absolute; left: 0; top: 8px; height: 2px; background: var(--accent); border-radius: 2px; }
    .np-info .rail .dot { position: absolute; top: 4px; width: 10px; height: 10px; margin-left: -5px; border-radius: 50%; background: var(--accent); box-shadow: 0 0 0 3px var(--paper); opacity: 0; transition: opacity .15s; }
    .np-info .rail:hover .dot, .np-info .rail:focus .dot { opacity: 1; }
    .np-info .rail:focus { outline: none; }
    .np-info .rail:focus-visible { outline: 2px solid var(--accent); outline-offset: 2px; border-radius: 4px; }

    /* Controls */
    .np-info .ctrls { display: flex; align-items: center; gap: 16px; }
    .np-info .ctl { width: 36px; height: 36px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .np-info .ctl:hover { color: var(--ink); }
    .np-info .ctl svg { width: 20px; height: 20px; }
    .np-info .ctl.on { color: var(--accent); }
    .np-info .play { width: 64px; height: 64px; border-radius: 50%; background: var(--ink); color: var(--paper); display: grid; place-items: center; transition: transform .15s; }
    .np-info .play:active { transform: scale(.94); }
    .np-info .play svg { width: 24px; height: 24px; }

    /* Queue list */
    .np-q .list { max-height: 60vh; overflow: auto; }
    .np-q .trow { display: grid; align-items: center; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .np-q .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .np-q .trow .art { border-radius: 7px; }
    .np-q .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .np-q .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .np-q .trow.cur .t { color: var(--accent); }

    /* Mobile */
    @media (max-width: 860px) {
      .np-in { grid-template-columns: 1fr; padding: 64px var(--gut) 40px; gap: 18px; }
      .disc { --S: 92vw; margin: 0 auto; justify-self: center; }
      .np-info h2 { font-size: clamp(44px, 15vw, 90px); }
      .np-q { margin-top: 10px; }
      .np-top { top: 12px; }
    }

    @media (prefers-reduced-motion:reduce) {
      .spinning { animation: none; }
    }
  `,document.head.appendChild(t)}function na(){l("#npClose",m).addEventListener("click",Rt),l("#nA",m).addEventListener("click",()=>{const{queue:t,queueIndex:e}=s.get();e>=0&&e<t.length}),T.addEventListener("pointerdown",pa),T.addEventListener("keydown",ua),F.addEventListener("pointerdown",ha),F.addEventListener("keydown",ga),l("#nCtrls",m).addEventListener("click",fa)}function Gt(){var B;const t=s.get(),{queue:e,queueIndex:a,isPlaying:i,currentTime:n,duration:o,shuffle:c,repeat:h,liked:x,currentTrack:y,queueContext:w}=t,S=typeof e[a]=="string"?e[a]:(B=e[a])==null?void 0:B.id,P=A?A.get():{tracks:{}},M=y||(S&&P.tracks?P.tracks[S]:null);if(!M){Rt();return}l("#nLabel",m).style.backgroundImage=M.art||"",l("#nT",m).textContent=M.title||"Unknown Track",l("#nA",m).textContent=M.artist||"Unknown Artist",l("#nAl",m).textContent=M.album?` · ${M.album}`:"",l("#nDur",m).textContent=ot(M.duration||o),l("#npFrom",m).textContent=`Playing from ${w||"DHUN"}`,M.glow&&(Kt("--glow",M.glow),Kt("--glow2",M.glow2||M.glow));const C=M.duration||o||240,N=C>0?z(n/C,0,1):0;ca(N),da(N),l("#nCur",m).textContent=ot(n),m.classList.toggle("paused",!i),ce.classList.toggle("paused",!i),ra(i,c,h,M,x),oa(e,a)}function ra(t,e,a,i,n){const o=l("#nCtrls",m),c=i&&n[i.id];o.innerHTML=`
    <button class="ctl" data-c="shuf" aria-label="Shuffle"${e?' class="on"':""}>${d("shuf")}</button>
    <button class="ctl" data-c="prev" aria-label="Previous">${d("prev")}</button>
    <button class="play" data-c="play" aria-label="${t?"Pause":"Play"}" style="width:64px;height:64px">${d(t?"pause":"play")}</button>
    <button class="ctl" data-c="next" aria-label="Next">${d("next")}</button>
    <button class="ctl" data-c="rep" aria-label="Repeat"${a>0?' class="on"':""}>${d(a===2?"rep1":"rep")}</button>
    <button class="ctl${c?" on":""}" data-c="like" aria-label="Like">${d(c?"heartOn":"heart")}</button>
  `}function oa(t,e,a){const i=l("#nQ",m),n=[];for(let o=1;o<=6&&o<t.length;o++){const c=(e+o)%t.length;n.push({id:t[c],index:c})}n.length?(i.innerHTML=n.map((o,c)=>sa(o)).join(""),la(i,n.map(o=>o.id))):i.innerHTML='<div class="empty" style="padding:10px 0">End of the queue.</div>'}function sa(t,e){return`<div class="trow" data-tid="${t.id}" role="button" tabindex="0">
    <span class="art cover" style="background-image:var(--paper-2)"></span>
    <span style="min-width:0"><span class="t">Track ${t.id}</span><span class="s">Unknown Artist</span></span>
  </div>`}function la(t,e,a){p(".trow",t).forEach((i,n)=>{i.addEventListener("click",()=>{const o=i.getAttribute("data-tid"),c=e.indexOf(o);c>=0&&s.set({queueIndex:c,currentTime:0,isPlaying:!0})}),i.addEventListener("keydown",o=>{(o.key==="Enter"||o.key===" ")&&(o.preventDefault(),i.click())})})}function ca(t){if(!T)return;const e=l(".arc",T),a=l(".knob",T);e.setAttribute("stroke-dasharray",`${z(t,0,1)*100} 100`);const i=t*Math.PI*2-Math.PI/2;a.setAttribute("cx",50+50*Math.cos(i)),a.setAttribute("cy",50+50*Math.sin(i)),T.setAttribute("aria-valuenow",Math.round(t*100))}function da(t){At&&(At.style.width=`${t*100}%`),Mt&&(Mt.style.left=`${t*100}%`),F&&F.setAttribute("aria-valuenow",Math.round(t*100))}function pa(t){t.button===0&&(jt=!0,T.setPointerCapture(t.pointerId),ue(t),T.addEventListener("pointermove",pe),T.addEventListener("pointerup",mt),T.addEventListener("pointercancel",mt))}function pe(t){jt&&ue(t)}function mt(t){jt=!1,T.releasePointerCapture(t.pointerId),T.removeEventListener("pointermove",pe),T.removeEventListener("pointerup",mt),T.removeEventListener("pointercancel",mt)}function ue(t){const{duration:e}=s.get();if(!e)return;const a=T.getBoundingClientRect(),i=a.left+a.width/2,n=a.top+a.height/2;let c=(Math.atan2(t.clientY-n,t.clientX-i)+Math.PI/2)/(Math.PI*2);c<0&&(c+=1),c=z(c,0,1),s.set({currentTime:c*e})}function ua(t){const{currentTime:e,duration:a}=s.get();if(!a)return;let i=e/a;if(t.key==="ArrowLeft")i=z(i-.01,0,1);else if(t.key==="ArrowRight")i=z(i+.01,0,1);else if(t.key==="Home")i=0;else if(t.key==="End")i=1;else return;t.preventDefault(),s.set({currentTime:i*a})}function ha(t){t.button===0&&(Nt=!0,F.setPointerCapture(t.pointerId),ge(t),F.addEventListener("pointermove",he),F.addEventListener("pointerup",vt),F.addEventListener("pointercancel",vt))}function he(t){Nt&&ge(t)}function vt(t){Nt=!1,F.releasePointerCapture(t.pointerId),F.removeEventListener("pointermove",he),F.removeEventListener("pointerup",vt),F.removeEventListener("pointercancel",vt)}function ge(t){const{duration:e}=s.get();if(!e)return;const a=F.getBoundingClientRect(),i=z((t.clientX-a.left)/a.width,0,1);s.set({currentTime:i*e})}function ga(t){const{currentTime:e,duration:a}=s.get();if(!a)return;let i=e/a;if(t.key==="ArrowLeft")i=z(i-.01,0,1);else if(t.key==="ArrowRight")i=z(i+.01,0,1);else if(t.key==="Home")i=0;else if(t.key==="End")i=1;else return;t.preventDefault(),s.set({currentTime:i*a})}function fa(t){const e=t.target.closest("[data-c]");if(!e)return;switch(e.getAttribute("data-c")){case"play":ma();break;case"next":va();break;case"prev":xa();break;case"shuf":ba();break;case"rep":ya();break;case"like":wa();break}}function ma(){const{isPlaying:t}=s.get();s.set({isPlaying:!t})}function va(){const{queue:t,queueIndex:e,shuffle:a,repeat:i}=s.get();if(!t.length)return;let n=e;if(a&&t.length>1)do n=Math.floor(Math.random()*t.length);while(n===e&&t.length>1);else if(e<t.length-1)n++;else if(i===1)n=0;else{s.set({isPlaying:!1,currentTime:0});return}s.set({queueIndex:n,currentTime:0,isPlaying:!0})}function xa(){const{queue:t,queueIndex:e,currentTime:a}=s.get();t.length&&(a>3?s.set({currentTime:0}):e>0?s.set({queueIndex:e-1,currentTime:0}):s.set({queueIndex:t.length-1,currentTime:0}))}function ba(){const{shuffle:t}=s.get();s.set({shuffle:!t})}function ya(){const{repeat:t}=s.get();s.set({repeat:(t+1)%3})}function wa(){const{queue:t,queueIndex:e,liked:a}=s.get();if(e<0||e>=t.length)return;const i=t[e],n={...a};n[i]?delete n[i]:n[i]=!0,s.set({liked:n})}function ka(){m||de(),m.hidden=!1,document.body.style.overflow="hidden",setTimeout(()=>{var t;return(t=l("#npClose",m))==null?void 0:t.focus()},100)}function Rt(){m&&(m.hidden=!0,document.body.style.overflow="hidden",location.hash==="#playing"&&(history.length>1?history.back():location.hash="#home"))}let q=null;function Ea(t){return q||(q=r("aside",{class:"side"},[r("div",{class:"logo"},["DHUN",r("i",{},"धुन")]),r("nav",{class:"side-nav"},[bt("home",d("home"),"Home"),bt("search",d("search"),"Search"),bt("library",d("library"),"Library")]),r("div",{class:"side-playlists"},[r("h4",{},"Playlists"),r("div",{id:"sidePl",class:"side-pl-list"})]),r("div",{id:"sideAuthSection",class:"side-auth"}),r("div",{class:"grow"}),r("div",{class:"side-footer"},[j("theme","",{"data-theme-toggle":!0,"aria-label":"Switch theme"}),r("a",{href:"#",id:"toLanding",class:"mono",style:"text-decoration:underline;text-underline-offset:4px"},"About DHUN")])]),t&&t.appendChild(q),$a(),Aa(),D.subscribe(Yt),L.subscribe(Jt),$.subscribe(Qt),Yt(D.get()),Jt(L.get()),Qt($.get()),q)}function bt(t,e,a){return r("button",{class:"nv","data-nav":t,"aria-label":a},[e,a])}function $a(){if(document.getElementById("sidebarStyles"))return;const t=document.createElement("style");t.id="sidebarStyles",t.textContent=`
    .side {
      grid-row: 1;
      display: flex;
      flex-direction: column;
      gap: 26px;
      padding: 24px 20px;
      border-right: 1px solid var(--line);
      overflow: auto;
    }
    .side-nav { display: flex; flex-direction: column; gap: 2px; }
    .nv {
      display: flex;
      align-items: center;
      gap: 12px;
      padding: 11px 12px;
      border-radius: 12px;
      font-weight: 600;
      font-size: 16px;
      text-align: left;
      color: var(--ink-2);
    }
    .nv svg { width: 20px; height: 20px; flex-shrink: 0; }
    .nv:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .nv.on { color: var(--ink); background: color-mix(in srgb, var(--ink) 7%, transparent); }
    .side h4 {
      margin: 0 0 8px 12px;
      font-family: var(--mono);
      font-weight: 400;
      font-size: 12px;
      color: var(--ink-2);
      text-transform: uppercase;
      letter-spacing: .06em;
    }
    .side-pl-list { display: flex; flex-direction: column; gap: 2px; }
    .pl {
      display: block;
      padding: 7px 12px;
      color: var(--ink-2);
      font-size: 14px;
      text-align: left;
      width: 100%;
      border-radius: 8px;
      border: 0;
      background: none;
    }
    .pl:hover { color: var(--ink); background: color-mix(in srgb, var(--ink) 5%, transparent); }
    .grow { flex: 1; }
    .side-footer { display: flex; gap: 10px; align-items: center; padding-top: 16px; border-top: 1px solid var(--line); }
    .side-footer .mono { color: var(--ink-2); font-size: 13px; }
    .side-footer .mono:hover { color: var(--accent); }

    @media (max-width: 860px) {
      .side { display: none; }
    }
  `,document.head.appendChild(t)}function Aa(){p("[data-nav]",q).forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-nav");E(e)})}),l("#sidePl",q).addEventListener("click",t=>{const e=t.target.closest("[data-playlist]");if(e){const a=e.getAttribute("data-playlist");E(`playlist-${a}`)}}),p("[data-theme-toggle]",q).forEach(t=>{t.addEventListener("click",Ma)}),l("#toLanding",q).addEventListener("click",t=>{t.preventDefault(),history.pushState("",document.title,location.pathname+location.search),window.location.hash=""})}function Yt(t){const e=l("#sidePl",q);if(!e)return;const{playlists:a}=t;if(a.length===0){e.innerHTML='<p class="mono" style="padding:12px;color:var(--ink-2)">No playlists yet</p>';return}e.innerHTML=a.map(i=>`<button class="pl" data-playlist="${i.id}">${Ct(i.name)}</button>`).join("")}function Jt(t){const{currentView:e}=t,i={home:"home",search:"search",library:"library",artist:"library",album:"library",playlist:"library",playing:""}[e]||"";p(".nv",q).forEach(n=>{n.classList.toggle("on",n.getAttribute("data-nav")===i)})}function Qt(t){var n,o;const{isAuthenticated:e,user:a}=t,i=l("#sideAuthSection",q);if(i)if(e&&a){const c=((n=a.user_metadata)==null?void 0:n.display_name)||((o=a.email)==null?void 0:o.split("@")[0])||"Member",h=c.charAt(0).toUpperCase();i.innerHTML=`
      <div class="user-profile">
        <div class="user-avatar">${h}</div>
        <div class="user-info">
          <span class="user-name">${Ct(c)}</span>
          <span class="user-role">${Ct(a.email||"Free Member")}</span>
        </div>
        <button class="icon-btn" id="sideLogoutBtn" title="Sign Out" aria-label="Sign Out" style="width:30px;height:30px">
          ${d("logout")}
        </button>
      </div>
    `;const x=l("#sideLogoutBtn",i);x&&x.addEventListener("click",async()=>{await at.logout()})}else{i.innerHTML=`
      <button class="nv" id="sideLoginBtn" aria-label="Sign In" style="width:100%;margin-bottom:6px">
        ${d("user")}
        <span>Sign In</span>
      </button>
    `;const c=l("#sideLoginBtn",i);c&&c.addEventListener("click",()=>{J("login")})}}function Ma(){const t=document.documentElement,e=t.getAttribute("data-theme"),a=window.matchMedia("(prefers-color-scheme: dark)").matches,n=e==="dark"||!e&&a?"light":"dark";t.setAttribute("data-theme",n),localStorage.setItem("dhun-theme",n)}function Ct(t){return String(t).replace(/&/g,"&").replace(/</g,"<").replace(/>/g,">").replace(/"/g,'"').replace(/'/g,"&#039;")}let G=null;function Ca(t){return G||(G=r("nav",{class:"tabbar",role:"tablist","aria-label":"Main navigation"},[yt("home",d("home"),"Home"),yt("search",d("search"),"Search"),yt("library",d("library"),"Library")]),t&&t.appendChild(G),La(),Sa(),L.subscribe(Xt),Xt(L.get()),G)}function yt(t,e,a){return r("button",{class:"tab","data-nav":t,role:"tab","aria-selected":"false","aria-label":a},[r("span",{class:"tab-icon"},e),r("span",{class:"tab-label"},a)])}function La(){if(document.getElementById("tabBarStyles"))return;const t=document.createElement("style");t.id="tabBarStyles",t.textContent=`
    .tabbar {
      display: none;
    }

    @media (max-width: 860px) {
      .tabbar {
        display: grid;
        grid-template-columns: repeat(3, 1fr);
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        background: var(--paper);
        border-top: 1px solid var(--line);
        padding: 8px 0 calc(8px + env(safe-area-inset-bottom, 0px));
        z-index: 6;
      }
      .tab {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 3px;
        font-size: 11px;
        font-weight: 600;
        color: var(--ink-2);
        padding: 4px 0;
      }
      .tab[aria-selected="true"] { color: var(--ink); }
      .tab .tab-icon { display: flex; }
      .tab .tab-icon svg { width: 22px; height: 22px; }
      .tab .tab-label { line-height: 1; }
    }
  `,document.head.appendChild(t)}function Sa(){p("[data-nav]",G).forEach(t=>{t.addEventListener("click",()=>{const e=t.getAttribute("data-nav");E(e)})})}function Xt(t){const{currentView:e}=t,i={home:"home",search:"search",library:"library",artist:"library",album:"library",playlist:"library",playing:""}[e]||"";p(".tab",G).forEach(n=>{const o=n.getAttribute("data-nav")===i;n.setAttribute("aria-selected",o)})}let rt=null;function Ta(){return rt=r("div",{class:"view",id:"view"}),Ga(),rt}function Ba(){if(!rt)return;const t=A.get(),{featuredArtist:e,newAlbums:a,popularTracks:i,artists:n}=t;rt.innerHTML=`
    ${Pa(e||Wa())}
    ${pt("Popular right now",Fa(i))}
    ${pt("New albums",qa(a))}
    ${pt("Pick a mood",za())}
    ${pt("Artists",Da(n))}
  `,Ra(rt)}function Pa(t){return`
    <section class="hero">
      <div class="txt">
        <div class="mono" style="color:var(--accent);margin-bottom:16px">${_a()}. Featured artist</div>
        <h1>${g(t.name).replace(" ","<br>")}</h1>
        <div class="genres">${g(t.genres)}</div>
        <div class="acts">
          <button class="btn accent" data-playartist="${t.id}">${d("play").replace("<svg",'<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-artist="${t.id}">See artist</button>
        </div>
      </div>
      ${Ia()}
    </section>
  `}function Ia(){return`
    <div class="mini-rec">
      <div class="vwrap">
        <div class="vinyl spinning">
          <div class="label"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="3.4" height="9" rx="1"/><rect x="8.4" y="4" width="3.4" height="14" rx="1"/><rect x="13.8" y="7" width="3.4" height="11" rx="1"/><rect x="19.2" y="11" width="3.4" height="7" rx="1"/></svg></div>
        </div>
        <div class="sheen"></div>
      </div>
      <svg class="ring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="50"/></svg>
    </div>
  `}function pt(t,e,a=null,i=null){return`
    <section class="sec">
      <div class="sec-h">
        <h2>${g(t)}</h2>
        ${a?`<button class="mono" data-nav="${i}" style="text-decoration:underline;text-underline-offset:4px">${g(a)}</button>`:""}
      </div>
      ${e}
    </section>
  `}function Fa(t){return!t||t.length===0?'<div class="list" id="hPop"></div>':`<div class="list" id="hPop">${t.slice(0,5).map((e,a)=>Ha(e,a)).join("")}</div>`}function qa(t){return!t||t.length===0?'<div class="cards"></div>':`<div class="cards">${t.slice(0,6).map(ja).join("")}</div>`}function za(){return`<div class="moods">${[{n:"Rain",d:"बारिश",bg:"#1E5F74",q:"baarish"},{n:"Journey",d:"सफ़र",bg:"#C2410C",q:"night-drive"},{n:"Night",d:"रात",bg:"#2B2A5C",q:"focus"},{n:"Romance",d:"इश्क़",bg:"#B0214F",q:"chai"}].map(e=>`<button class="mood" data-mood="${e.q}" style="background:${e.bg}"><b lang="hi">${g(e.d)}</b><span>${g(e.n)}</span></button>`).join("")}</div>`}function Da(t){return!t||t.length===0?'<div class="cards"></div>':`<div class="cards">${t.map(Na).join("")}</div>`}function Ha(t,e){return`
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${g(t.title)}">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art||""}"></span>
      <span style="min-width:0"><span class="t">${g(t.title)}</span><span class="s">${g(t.artist||t.album||"")}</span></span>
      <span class="d mono">${ot(t.duration||0)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function ja(t){return`
    <button class="card" data-album="${t.id}">
      <div class="art cover" style="background-image:${t.art||""};--c:${t.glow||""}"></div>
      <b>${g(t.title)}</b>
      <span>${g(t.artist)} · ${t.year}</span>
    </button>
  `}function Na(t){return`
    <button class="card" data-artist="${t.id}">
      <div class="art cover" style="background-image:${t.art||""};--c:${t.glow||""};border-radius:50%"></div>
      <b>${g(t.name)}</b>
      <span>${Ae(t.listeners||0)} listeners</span>
    </button>
  `}function Ra(t){p("[data-playartist]",t).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-playartist");Ka(a)})}),p("[data-artist]",t).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-artist");E(`artist-${a}`)})}),p("[data-album]",t).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-album");E(`album-${a}`)})}),p("[data-mood]",t).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-mood");E(`playlist-${a}`)})}),Oa(t,"Popular on DHUN"),p("[data-nav]",t).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-nav");E(a)})})}function Oa(t,e){p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{if(i.target.closest("[data-like]"))return;const n=a.getAttribute("data-tid");Ua(n,e,t)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})}),p("[data-like]",t).forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation();const n=a.getAttribute("data-like");Va(n)})})}function Ua(t,e,a){const i=p(".trow",a),n=Array.from(i).map(x=>x.getAttribute("data-tid")),o=n.indexOf(t),h=A.get().tracks[t]||{id:t};s.set({queue:n,queueIndex:o,queueContext:e,currentTime:0,isPlaying:!0,currentTrack:h})}function Ka(t){const e=A.get(),a=[];if(Object.values(e.albums).forEach(i=>{var n;i.artistId===t&&((n=i.trackIds)==null||n.forEach(o=>a.push(o)))}),a.length){const i=e.tracks[a[0]]||{id:a[0]};s.set({queue:a,queueIndex:0,queueContext:t,currentTime:0,isPlaying:!0,currentTrack:i})}}function Va(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i})}function _a(){const t=new Date().getHours();return t<5?"Still up":t<12?"Good morning":t<17?"Good afternoon":"Good evening"}function Wa(){return{id:"raag-circuit",name:"Raag Circuit",genres:"Electronic raga, downtempo, sitar wave",listeners:"2.4M monthly listeners"}}function Ga(){if(document.getElementById("homeViewStyles"))return;const t=document.createElement("style");t.id="homeViewStyles",t.textContent=`
    .main {
      grid-row: 1;
      grid-column: 2;
      overflow: auto;
      padding: 36px max(32px, env(safe-area-inset-right, 0px)) 40px 36px;
      scroll-behavior: smooth;
    }
    .view { max-width: 1180px; margin: 0 auto; }
    .hero {
      position: relative;
      min-height: min(62svh, 560px);
      display: flex;
      align-items: center;
      margin-bottom: 46px;
    }
    .hero .txt { position: relative; z-index: 2; max-width: 70%; }
    .hero h1 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .8; font-size: clamp(64px, 10.5vw, 170px); }
    .hero .genres { font-family: var(--mono); font-size: 12px; text-transform: uppercase; margin: 20px 0 22px; color: var(--ink-2); }
    .hero .acts { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .hero .mini-rec { position: absolute; right: calc(var(--r, 0px) * -.34); top: 50%; width: var(--r); height: var(--r); margin-top: calc(var(--r)/-2); z-index: 1; }
    .hero { --r: min(52vw, 560px, 70svh); }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .sec-h button { font-family: var(--mono); font-size: 12px; text-decoration: underline; text-underline-offset: 4px; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .moods { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
    .mood { aspect-ratio: 1.25; border-radius: 14px; padding: 16px; text-align: left; display: flex; flex-direction: column; justify-content: space-between; color: #fff; position: relative; overflow: hidden; }
    .mood b { font-family: var(--deva); font-size: clamp(30px, 3.6vw, 54px); font-weight: 800; line-height: 1.1; }
    .mood span { font-weight: 700; font-stretch: 75%; font-size: 20px; letter-spacing: -.01em; }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }

    @media (max-width: 860px) {
      .main { grid-column: 1; padding: 20px var(--gut) 190px; }
      .hero .txt { max-width: 100%; }
      .hero { --r: 92vw; overflow: hidden; min-height: 430px; margin-bottom: 34px; }
      .hero .mini-rec { top: auto; bottom: -40vw; margin-top: 0; right: -58vw; -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); }
      .hero h1 { font-size: clamp(56px, 17vw, 120px); }
      .moods { grid-template-columns: 1fr 1fr; }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let _=null,fe=null,K=null,Zt=null;function Ya(){return _=r("div",{class:"view",id:"view"}),ai(),_}function Ja(){_&&(_.innerHTML=`
    <div class="search-big">
      ${d("search")}
      <input id="sq" type="search" placeholder="Search songs, artists, albums" autocomplete="off" aria-label="Search">
    </div>
    <div class="chips" id="chips"></div>
    <div id="sres"></div>
  `,fe=l("#sq",_),K=l("#sres",_),Qa(),me(),Lt())}function Qa(){Zt=Me(()=>{Lt()},300),fe.addEventListener("input",t=>{L.set({searchQuery:t.target.value}),Zt()}),l("#chips",_).addEventListener("click",t=>{const e=t.target.closest("[data-chip]");if(e){const a=e.getAttribute("data-chip"),i=L.get().searchChips,n=i.includes(a)?i.filter(o=>o!==a):[...i,a];L.set({searchChips:n}),me(),Lt()}}),K.addEventListener("click",t=>{const e=t.target.closest("[data-artist]");if(e){E(`artist-${e.getAttribute("data-artist")}`);return}const a=t.target.closest("[data-album]");if(a){E(`album-${a.getAttribute("data-album")}`);return}const i=t.target.closest(".trow");if(i&&!t.target.closest("[data-like]")){const o=i.getAttribute("data-tid");xe(o);return}const n=t.target.closest("[data-like]");if(n){t.stopPropagation();const o=n.getAttribute("data-like");be(o);return}}),K.addEventListener("keydown",t=>{(t.key==="Enter"||t.key===" ")&&t.target.closest(".trow")&&(t.preventDefault(),t.target.closest(".trow").click())})}function me(){const t=["Hindi","Tamil","Punjabi","Bangla","Malayalam","Indie","Lo-fi","Jazz","Pop"],e=L.get().searchChips,a=l("#chips",_);a.innerHTML=t.map(i=>`<button class="chip${e.includes(i)?" on":""}" data-chip="${i}">${g(i)}</button>`).join("")}function Lt(){const{searchQuery:t,searchChips:e}=L.get(),a=(t+" "+e.join(" ")).trim().toLowerCase();if(!a){Xa();return}const i=a.split(/\s+/),n=A.get(),o=w=>(w=w.toLowerCase(),i.every(S=>w.includes(S))),c=Object.values(n.tracks).filter(w=>o(`${w.title} ${w.artist} ${w.album} ${w.genres||""}`)),h=Object.values(n.artists).filter(w=>o(`${w.name} ${w.genres}`)),x=Object.values(n.albums).filter(w=>o(`${w.title} ${w.artist}`));if(!c.length&&!h.length&&!x.length){K.innerHTML=`
      <div class="empty">
        <b>Nothing for "${g(t||e.join(" "))}"</b>
        Check the spelling, or try a language, a mood or an artist name.
      </div>
    `;return}let y="";h.length&&(y+=`
      <section class="sec">
        <div class="sec-h"><h2>Artists</h2></div>
        <div class="cards">${h.slice(0,8).map(ti).join("")}</div>
      </section>
    `),c.length&&(y+=`
      <section class="sec">
        <div class="sec-h"><h2>Songs</h2></div>
        <div class="list" id="sList">${c.slice(0,20).map((w,S)=>Za(w,S)).join("")}</div>
      </section>
    `),x.length&&(y+=`
      <section class="sec">
        <div class="sec-h"><h2>Albums</h2></div>
        <div class="cards">${x.slice(0,8).map(ye).join("")}</div>
      </section>
    `),K.innerHTML=y,ve(K)}function Xa(){const t=A.get();K.innerHTML=`
    <section class="sec">
      <div class="sec-h"><h2>Browse all</h2></div>
      <div class="cards">${Object.values(t.albums).slice(0,12).map(ye).join("")}</div>
    </section>
  `,ve(K)}function ve(t){p("[data-artist]",t).forEach(e=>{e.addEventListener("click",()=>E(`artist-${e.getAttribute("data-artist")}`))}),p("[data-album]",t).forEach(e=>{e.addEventListener("click",()=>E(`album-${e.getAttribute("data-album")}`))}),p(".trow",t).forEach(e=>{e.addEventListener("click",a=>{a.target.closest("[data-like]")||xe(e.getAttribute("data-tid"))}),e.addEventListener("keydown",a=>{(a.key==="Enter"||a.key===" ")&&(a.preventDefault(),e.click())})}),p("[data-like]",t).forEach(e=>{e.addEventListener("click",a=>{a.stopPropagation(),be(e.getAttribute("data-like"))})})}function xe(t){const a=A.get().tracks[t];if(!a)return;const i=p(".trow[data-tid]",K),n=Array.from(i).map(c=>c.getAttribute("data-tid")),o=n.indexOf(t);s.set({queue:n,queueIndex:o,queueContext:"Search results",currentTime:0,isPlaying:!0,currentTrack:a})}function be(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i})}function Za(t,e){return`
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${g(t.title)}">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art||""}"></span>
      <span style="min-width:0"><span class="t">${g(t.title)}</span><span class="s">${g(t.artist)}</span></span>
      <span class="d mono">${ei(t.duration||0)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function ye(t){return`
    <button class="card" data-album="${t.id}">
      <div class="art cover" style="background-image:${t.art||""};--c:${t.glow||""}"></div>
      <b>${g(t.title)}</b>
      <span>${g(t.artist)} · ${t.year}</span>
    </button>
  `}function ti(t){return`
    <button class="card" data-artist="${t.id}">
      <div class="art cover" style="background-image:${t.art||""};--c:${t.glow||""};border-radius:50%"></div>
      <b>${g(t.name)}</b>
      <span>Artist</span>
    </button>
  `}function ei(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/60),i=e%60;return`${a}:${String(i).padStart(2,"0")}`}function ai(){if(document.getElementById("searchViewStyles"))return;const t=document.createElement("style");t.id="searchViewStyles",t.textContent=`
    .search-big { display: flex; align-items: center; gap: 14px; border-bottom: 2px solid var(--ink); padding-bottom: 10px; margin-bottom: 34px; }
    .search-big svg { width: 30px; height: 30px; flex: none; color: var(--ink-2); }
    .search-big input { flex: 1; min-width: 0; background: none; border: 0; outline: 0; font: 800 clamp(34px, 6vw, 84px)/1 var(--display); font-stretch: 75%; letter-spacing: -.04em; color: var(--ink); }
    .search-big input::placeholder { color: var(--ink-2); opacity: .5; }
    .chips { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 34px; }
    .chip { border: 1px solid var(--line); border-radius: 999px; padding: 8px 16px; font-size: 14px; font-weight: 550; }
    .chip:hover, .chip.on { background: var(--ink); color: var(--paper); border-color: var(--ink); }
    .empty { padding: 50px 0; color: var(--ink-2); max-width: 42ch; text-align: center; }
    .empty b { display: block; color: var(--ink); font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -.02em; }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }

    @media (max-width: 860px) {
      .search-big input { font-size: clamp(28px, 8vw, 56px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let St=null,Y="playlists";function ii(){return St=r("div",{class:"view",id:"view"}),wi(),St}function Ot(){if(!St)return;const{isAuthenticated:t}=$.get(),{playlists:e,likedSongs:a,followedArtists:i,savedAlbums:n,recentlyPlayed:o}=D.get();if(!t){view.innerHTML=ni(),ri(view);return}view.innerHTML=`
    <div class="tabs-l">
      <button data-lib="playlists" class="${Y==="playlists"?"on":""}">Playlists</button>
      <button data-lib="liked" class="${Y==="liked"?"on":""}">Liked</button>
      <button data-lib="artists" class="${Y==="artists"?"on":""}">Artists</button>
      <button data-lib="albums" class="${Y==="albums"?"on":""}">Albums</button>
      <button data-lib="recent" class="${Y==="recent"?"on":""}">Recent</button>
    </div>
    ${oi()}
  `,pi(view)}function ni(){return`
    <div class="empty" style="text-align:center;padding:60px 20px">
      <div style="font-size:48px;margin-bottom:16px">${d("userPlus")}</div>
      <b style="font-size:22px;display:block;margin-bottom:8px">Sign in to access your library</b>
      <span style="color:var(--ink-2);display:block;margin-bottom:24px">Your playlists, liked songs, and history will be saved across devices</span>
      <button class="btn accent" id="guestLogin">${d("user").replace("<svg",'<svg width="16" height="16"')}Sign In</button>
    </div>
  `}function ri(t){l("#guestLogin",t).addEventListener("click",()=>J("login"))}function oi(){const{playlists:t,likedSongs:e,followedArtists:a,savedAlbums:i,recentlyPlayed:n}=D.get();switch(Y){case"playlists":return te(t);case"liked":return si(e);case"artists":return li(a);case"albums":return ci(i);case"recent":return di(n);default:return te(t)}}function te(t){return t.length===0?`
      <div class="empty">
        <b>No playlists yet</b>
        Create your first playlist to start organizing your music
      </div>
      <button class="btn accent" id="createPlaylist" style="margin-top:16px">${d("plus").replace("<svg",'<svg width="16" height="16"')}Create Playlist</button>
    `:`
    <div class="cards">
      ${t.map(e=>fi(e)).join("")}
    </div>
    <button class="btn line" id="createPlaylist" style="margin-top:16px;justify-content:center">${d("plus").replace("<svg",'<svg width="16" height="16"')}Create Playlist</button>
  `}function si(t){return t.length===0?`
      <div class="empty">
        <b>No liked songs yet</b>
        Tap the heart next to any song and it will show up here
      </div>
    `:`
    <div class="list" id="lkList">
      ${t.map((e,a)=>mi(e,a)).join("")}
    </div>
  `}function li(t){return t.length===0?`
      <div class="empty">
        <b>No followed artists</b>
        Follow artists to see their new releases here
      </div>
    `:`
    <div class="cards">
      ${t.map(e=>vi(e)).join("")}
    </div>
  `}function ci(t){return t.length===0?`
      <div class="empty">
        <b>No saved albums</b>
        Save albums to access them quickly
      </div>
    `:`
    <div class="cards">
      ${t.map(e=>xi(e)).join("")}
    </div>
  `}function di(t){return t.length===0?`
      <div class="empty">
        <b>No recent activity</b>
        Start listening to build your history
      </div>
    `:`
    <div class="list" id="recentList">
      ${t.map((e,a)=>bi(e,a)).join("")}
    </div>
  `}function pi(t){p("[data-lib]",t).forEach(a=>{a.addEventListener("click",()=>{Y=a.getAttribute("data-lib"),Ot()})});const e=l("#createPlaylist",t);e&&e.addEventListener("click",()=>ui()),p("[data-playlist]",t).forEach(a=>{a.addEventListener("click",()=>{const i=a.getAttribute("data-playlist");E(`playlist-${i}`)})}),p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{if(i.target.closest("[data-like]"))return;const n=a.getAttribute("data-tid");hi(n,t)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})}),p("[data-like]",t).forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),gi(a.getAttribute("data-like"))})}),p("[data-artist]",t).forEach(a=>{a.addEventListener("click",()=>E(`artist-${a.getAttribute("data-artist")}`))}),p("[data-album]",t).forEach(a=>{a.addEventListener("click",()=>E(`album-${a.getAttribute("data-album")}`))})}function ui(){const t=r("div",{class:"modal-overlay",role:"dialog","aria-modal":"true","aria-labelledby":"createPlTitle"},[r("div",{class:"modal"},[r("button",{class:"modal-close","aria-label":"Close",onclick:()=>ut(t)},d("close")),r("h2",{id:"createPlTitle"},"Create Playlist"),r("form",{id:"createPlForm"},[r("div",{class:"form-group"},[r("label",{for:"plName"},"Playlist Name"),r("input",{type:"text",id:"plName",name:"name",required:!0,placeholder:"My Awesome Playlist",maxlength:100})]),r("div",{class:"form-group"},[r("label",{for:"plDesc"},"Description (optional)"),r("textarea",{id:"plDesc",name:"description",rows:3,placeholder:"What's this playlist about?"})]),r("div",{class:"form-group"},[r("label",{class:"checkbox-label"},[r("input",{type:"checkbox",name:"public",checked:!0}),r("span",{},"Make public")])]),r("div",{class:"modal-actions"},[r("button",{type:"button",class:"btn line",onclick:()=>ut(t)},"Cancel"),r("button",{type:"submit",class:"btn accent"},"Create")])])])]);document.body.appendChild(t),t.offsetHeight,t.classList.add("open"),document.body.style.overflow="hidden",l("#plName",t).focus(),l("#createPlForm",t).addEventListener("submit",async e=>{e.preventDefault();const a=e.target,i=a.name.value.trim(),n=a.description.value.trim(),o=a.public.checked;if(!i)return;const c={id:"pl-"+Date.now(),name:i,description:n,cover:null,tracks:[],isPublic:o,createdAt:Date.now()};D.set({playlists:[...D.get().playlists,c]}),ut(t),Ot()}),t.addEventListener("click",e=>{e.target===t&&ut(t)})}function ut(t){t.classList.remove("open"),setTimeout(()=>t.remove(),200),document.body.style.overflow=""}function hi(t,e){const a=p(".trow[data-tid]",e),i=Array.from(a).map(c=>c.getAttribute("data-tid")),n=i.indexOf(t);D.get();const o={id:t};s.set({queue:i,queueIndex:n,queueContext:"Library",currentTime:0,isPlaying:!0,currentTrack:o})}function gi(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i});const n=D.get(),o=n.likedSongs.includes(t)?n.likedSongs.filter(c=>c!==t):[...n.likedSongs,t];D.set({likedSongs:o})}function fi(t){var a;const e=t.cover||`url('data:image/svg+xml,${encodeURIComponent('<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200"><rect fill="#EBEBE6" width="200" height="200"/></svg>').replace(/'/g,"%27")}')`;return`
    <button class="card" data-playlist="${t.id}">
      <div class="art cover" style="background-image:${e}"></div>
      <b>${g(t.name)}</b>
      <span>${((a=t.tracks)==null?void 0:a.length)||0} songs</span>
    </button>
  `}function mi(t,e){return`
    <div class="trow" data-tid="${t}" role="button" tabindex="0">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:var(--paper-2)"></span>
      <span style="min-width:0"><span class="t">Track ${t}</span><span class="s">Unknown Artist</span></span>
      <span class="d mono">0:00</span>
      <button class="lk on" data-like="${t}" aria-label="Unlike">${d("heartOn")}</button>
    </div>
  `}function vi(t){return`
    <button class="card" data-artist="${t}">
      <div class="art cover" style="background-image:var(--paper-2);border-radius:50%"></div>
      <b>Artist ${t}</b>
      <span>Artist</span>
    </button>
  `}function xi(t){return`
    <button class="card" data-album="${t}">
      <div class="art cover" style="background-image:var(--paper-2)"></div>
      <b>Album ${t}</b>
      <span>Album</span>
    </button>
  `}function bi(t,e){return`
    <div class="trow" data-tid="${t.trackId}" role="button" tabindex="0">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:var(--paper-2)"></span>
      <span style="min-width:0"><span class="t">Track ${t.trackId}</span><span class="s">Unknown Artist</span></span>
      <span class="d mono">${yi(t.progress||0)}</span>
      <button class="lk" data-like="${t.trackId}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function yi(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/60),i=e%60;return`${a}:${String(i).padStart(2,"0")}`}function wi(){if(document.getElementById("libraryViewStyles"))return;const t=document.createElement("style");t.id="libraryViewStyles",t.textContent=`
    .tabs-l { display: flex; gap: 26px; margin-bottom: 28px; overflow-x: auto; padding-bottom: 8px; }
    .tabs-l button { font-weight: 800; font-stretch: 75%; letter-spacing: -.035em; font-size: clamp(34px, 5vw, 70px); line-height: 1; color: var(--ink-2); opacity: .55; white-space: nowrap; }
    .tabs-l button.on { color: var(--ink); opacity: 1; }
    .empty { padding: 50px 0; color: var(--ink-2); max-width: 42ch; text-align: center; }
    .empty b { display: block; color: var(--ink); font-size: 22px; font-weight: 700; margin-bottom: 6px; letter-spacing: -.02em; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }
    .modal-actions { display: flex; gap: 12px; justify-content: flex-end; margin-top: 24px; }
    .checkbox-label { display: flex; align-items: center; gap: 8px; cursor: pointer; color: var(--ink-2); }
    .checkbox-label input { width: 18px; height: 18px; accent-color: var(--accent); }

    @media (max-width: 860px) {
      .tabs-l { gap: 16px; }
      .tabs-l button { font-size: clamp(28px, 6vw, 50px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let Tt=null;function ki(){return Tt=r("div",{class:"view",id:"view"}),Di(),Tt}function Ei(t){if(!Tt)return;const{id:e}=t,a=A.get(),i=a.artists[e];if(!i){view.innerHTML=zi("Artist");return}const n=Object.values(a.albums).filter(h=>h.artistId===e),c=n.flatMap(h=>h.trackIds||[]).slice(0,5).map(h=>a.tracks[h]).filter(Boolean);view.innerHTML=`
    ${$i(i)}
    ${ee("Popular",Mi(c,{context:i.name}))}
    ${ee("Albums",Ci(n))}
  `,Li(view,i)}function $i(t){return`
    <section class="hero">
      <div class="txt">
        <div class="mono" style="color:var(--accent);margin-bottom:16px">${g(t.listeners||"Artist")}</div>
        <h1>${g(t.name).replace(/ (&|The|Club|Circuit|Sethi|Hours|Quartet)/,"<br>$1")}</h1>
        <div class="genres">${g(t.genres)}</div>
        <div class="acts">
          <button class="btn accent" data-playartist="${t.id}">${d("play").replace("<svg",'<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-follow>${t.followed?"Following":"Follow"}</button>
        </div>
      </div>
      ${Ai()}
    </section>
  `}function Ai(){return`
    <div class="mini-rec">
      <div class="vwrap">
        <div class="vinyl spinning">
          <div class="label"><svg viewBox="0 0 24 24" fill="currentColor"><rect x="3" y="9" width="3.4" height="9" rx="1"/><rect x="8.4" y="4" width="3.4" height="14" rx="1"/><rect x="13.8" y="7" width="3.4" height="11" rx="1"/><rect x="19.2" y="11" width="3.4" height="7" rx="1"/></svg></div>
        </div>
        <div class="sheen"></div>
      </div>
      <svg class="ring" viewBox="0 0 100 100"><circle class="trk" cx="50" cy="50" r="50"/></svg>
    </div>
  `}function ee(t,e){return`
    <section class="sec">
      <div class="sec-h"><h2>${g(t)}</h2></div>
      ${e}
    </section>
  `}function Mi(t,e={}){return t.length?`<div class="list" id="aList">${t.map((a,i)=>Ii(a,i,e)).join("")}</div>`:'<div class="list"></div>'}function Ci(t){return t.length?`<div class="cards">${t.map(Fi).join("")}</div>`:'<div class="cards"></div>'}function Li(t,e){p("[data-playartist]",t).forEach(i=>{i.addEventListener("click",()=>Si(e.id))});const a=l("[data-follow]",t);a&&a.addEventListener("click",()=>{const i=a.classList.toggle("on");a.textContent=i?"Following":"Follow",a.style.background=i?"var(--ink)":"",a.style.color=i?"var(--paper)":""}),p("[data-album]",t).forEach(i=>{i.addEventListener("click",()=>E(`album-${i.getAttribute("data-album")}`))}),Ti(t,e.name)}function Si(t){const e=A.get(),i=Object.values(e.albums).filter(n=>n.artistId===t).flatMap(n=>n.trackIds||[]);if(i.length){const n=e.tracks[i[0]]||{id:i[0]};s.set({queue:i,queueIndex:0,queueContext:t,currentTime:0,isPlaying:!0,currentTrack:n})}}function Ti(t,e){p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{i.target.closest("[data-like]")||Bi(a.getAttribute("data-tid"),e,t)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})}),p("[data-like]",t).forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),Pi(a.getAttribute("data-like"))})})}function Bi(t,e,a){const i=p(".trow[data-tid]",a),n=Array.from(i).map(x=>x.getAttribute("data-tid")),o=n.indexOf(t),h=A.get().tracks[t]||{id:t};s.set({queue:n,queueIndex:o,queueContext:e,currentTime:0,isPlaying:!0,currentTrack:h})}function Pi(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i})}function Ii(t,e,a={}){const i=a.showAlbum!==!1;return`
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${g(t.title)}">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art||""}"></span>
      <span style="min-width:0"><span class="t">${g(t.title)}</span><span class="s">${g(i&&t.album?t.album:t.artist)}</span></span>
      <span class="d mono">${qi(t.duration||0)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function Fi(t){return`
    <button class="card" data-album="${t.id}">
      <div class="art cover" style="background-image:${t.art||""};--c:${t.glow||""}"></div>
      <b>${g(t.title)}</b>
      <span>${g(t.artist)} · ${t.year}</span>
    </button>
  `}function qi(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/60),i=e%60;return`${a}:${String(i).padStart(2,"0")}`}function zi(t){return`
    <div class="empty" style="text-align:center;padding:60px 20px">
      <b style="font-size:22px;display:block;margin-bottom:8px">${t} not found</b>
      <span style="color:var(--ink-2)">This ${t.toLowerCase()} doesn't exist or has been removed</span>
      <button class="btn line" style="margin-top:24px" onclick="window.location.hash='home'">Go Home</button>
    </div>
  `}function Di(){if(document.getElementById("artistViewStyles"))return;const t=document.createElement("style");t.id="artistViewStyles",t.textContent=`
    .hero { position: relative; min-height: min(62svh, 560px); display: flex; align-items: center; margin-bottom: 46px; }
    .hero .txt { position: relative; z-index: 2; max-width: 70%; }
    .hero h1 { margin: 0; font-weight: 800; font-stretch: 75%; text-transform: uppercase; letter-spacing: -.045em; line-height: .8; font-size: clamp(64px, 10.5vw, 170px); }
    .hero .genres { font-family: var(--mono); font-size: 12px; text-transform: uppercase; margin: 20px 0 22px; color: var(--ink-2); }
    .hero .acts { display: flex; gap: 12px; align-items: center; flex-wrap: wrap; }
    .hero .mini-rec { position: absolute; right: calc(var(--r, 0px) * -.34); top: 50%; width: var(--r); height: var(--r); margin-top: calc(var(--r)/-2); z-index: 1; }
    .hero { --r: min(52vw, 560px, 70svh); }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .cards { display: grid; grid-template-columns: repeat(auto-fill, minmax(176px, 1fr)); gap: 24px 22px; }
    .card { text-align: left; display: block; width: 100%; }
    .card .art { aspect-ratio: 1; border-radius: 10px; box-shadow: 0 22px 34px -22px var(--c, #000); transition: transform .25s; }
    .card:hover .art { transform: translateY(-4px); }
    .card b { display: block; margin-top: 12px; font-weight: 650; font-size: 16px; letter-spacing: -.01em; }
    .card span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }

    @media (max-width: 860px) {
      .hero .txt { max-width: 100%; }
      .hero { --r: 92vw; overflow: hidden; min-height: 430px; margin-bottom: 34px; }
      .hero .mini-rec { top: auto; bottom: -40vw; margin-top: 0; right: -58vw; -webkit-mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); mask-image: linear-gradient(to bottom, #000 62%, transparent 88%); }
      .hero h1 { font-size: clamp(56px, 17vw, 120px); }
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let Bt=null;function Hi(){return Bt=r("div",{class:"view",id:"view"}),Qi(),Bt}function ji(t){if(!Bt)return;const{id:e}=t,a=A.get(),i=a.albums[e];if(!i){view.innerHTML=Ji("Album");return}const n=(i.trackIds||[]).map(o=>a.tracks[o]).filter(Boolean);view.innerHTML=`
    ${Ni(i,n)}
    ${Ri("Tracks",Oi(n))}
  `,Ui(view,i)}function Ni(t,e){const a=e.reduce((n,o)=>n+(o.duration||0),0),i=Math.round(a/60);return`
    <section class="hero" style="min-height:0;margin-bottom:34px;gap:34px;align-items:flex-end;flex-wrap:wrap">
      <div class="art cover" style="width:min(300px,72vw);aspect-ratio:1;border-radius:12px;background-image:${t.art||""};box-shadow:0 36px 60px -30px ${t.glow||""}"></div>
      <div style="min-width:0;flex:1">
        <div class="mono" style="color:var(--accent)">Album · ${t.year}</div>
        <h1 style="font-weight:800;font-stretch:75%;text-transform:uppercase;letter-spacing:-.045em;line-height:.84;font-size:clamp(46px,8vw,120px);margin:12px 0 16px;overflow-wrap:anywhere">${g(t.title)}</h1>
        <div class="acts" style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <button class="btn accent" data-playalbum="${t.id}">${d("play").replace("<svg",'<svg width="16" height="16"')}Play</button>
          <button class="btn line" data-artist="${t.artistId}">${g(t.artist)}</button>
          <span class="mono" style="color:var(--ink-2)">${e.length} songs, ${i} min</span>
        </div>
      </div>
    </section>
  `}function Ri(t,e){return`
    <section class="sec">
      <div class="sec-h"><h2>${g(t)}</h2></div>
      ${e}
    </section>
  `}function Oi(t){return t.length?`<div class="list" id="aList">${t.map((e,a)=>Gi(e,a)).join("")}</div>`:'<div class="list"></div>'}function Ui(t,e){p("[data-playalbum]",t).forEach(a=>{a.addEventListener("click",()=>Ki(e))}),p("[data-artist]",t).forEach(a=>{a.addEventListener("click",()=>E(`artist-${a.getAttribute("data-artist")}`))}),Vi(t,e.title)}function Ki(t){const e=A.get(),a=(t.trackIds||[]).filter(i=>e.tracks[i]);if(a.length){const i=e.tracks[a[0]]||{id:a[0]};s.set({queue:a,queueIndex:0,queueContext:t.title,currentTime:0,isPlaying:!0,currentTrack:i})}}function Vi(t,e){p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{i.target.closest("[data-like]")||_i(a.getAttribute("data-tid"),e,t)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})}),p("[data-like]",t).forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),Wi(a.getAttribute("data-like"))})})}function _i(t,e,a){const i=p(".trow[data-tid]",a),n=Array.from(i).map(x=>x.getAttribute("data-tid")),o=n.indexOf(t),h=A.get().tracks[t]||{id:t};s.set({queue:n,queueIndex:o,queueContext:e,currentTime:0,isPlaying:!0,currentTrack:h})}function Wi(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i})}function Gi(t,e){return`
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${g(t.title)}">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art||""}"></span>
      <span style="min-width:0"><span class="t">${g(t.title)}</span><span class="s">${g(t.artist)}</span></span>
      <span class="d mono">${Yi(t.duration||0)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function Yi(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/60),i=e%60;return`${a}:${String(i).padStart(2,"0")}`}function Ji(t){return`
    <div class="empty" style="text-align:center;padding:60px 20px">
      <b style="font-size:22px;display:block;margin-bottom:8px">${t} not found</b>
      <span style="color:var(--ink-2)">This ${t.toLowerCase()} doesn't exist or has been removed</span>
      <button class="btn line" style="margin-top:24px" onclick="window.location.hash='home'">Go Home</button>
    </div>
  `}function Qi(){if(document.getElementById("albumViewStyles"))return;const t=document.createElement("style");t.id="albumViewStyles",t.textContent=`
    .hero { position: relative; min-height: min(62svh, 560px); display: flex; align-items: center; margin-bottom: 46px; }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }

    @media (max-width: 860px) {
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let Pt=null;function Xi(){return Pt=r("div",{class:"view",id:"view"}),un(),Pt}function Zi(t){if(!Pt)return;const{id:e}=t,a=D.get(),i=A.get();let n=a.playlists.find(c=>c.id===e);if(n||(n=i.playlists[e]),!n){view.innerHTML=pn("Playlist");return}const o=(n.trackIds||[]).map(c=>i.tracks[c]).filter(Boolean);view.innerHTML=`
    ${tn(n,o)}
    ${en("Tracks",an(o))}
  `,nn(view,n)}function tn(t,e){const a=e.reduce((c,h)=>c+(h.duration||0),0),i=Math.round(a/60),n=e.slice(0,4);return`
    <section class="hero" style="min-height:0;margin-bottom:34px;gap:34px;align-items:flex-end;flex-wrap:wrap">
      <div style="width:min(300px,72vw);flex:none">${n.length>0?`<div class="mosaic">${n.map(c=>`<i style="background-image:${c.art||"var(--paper-2)"}"></i>`).join("")}</div>`:'<div class="mosaic art" style="background:var(--paper-2)"></div>'}</div>
      <div style="min-width:0;flex:1">
        <div class="mono" style="color:var(--accent)">Playlist</div>
        <h1 style="font-weight:800;font-stretch:75%;text-transform:uppercase;letter-spacing:-.045em;line-height:.84;font-size:clamp(46px,8vw,120px);margin:12px 0 16px">${g(t.name)}</h1>
        <div style="display:flex;gap:12px;align-items:center;flex-wrap:wrap">
          <button class="btn accent" data-playlist-play="${t.id}">${d("play").replace("<svg",'<svg width="16" height="16"')}Play</button>
          <span class="mono" style="color:var(--ink-2)">${e.length} songs, ${i} min</span>
        </div>
      </div>
    </section>
  `}function en(t,e){return`
    <section class="sec">
      <div class="sec-h"><h2>${g(t)}</h2></div>
      ${e}
    </section>
  `}function an(t){return t.length?`<div class="list" id="aList">${t.map((e,a)=>cn(e,a)).join("")}</div>`:'<div class="list"></div>'}function nn(t,e){p("[data-playlist-play]",t).forEach(a=>{a.addEventListener("click",()=>rn(e))}),on(t,e.name)}function rn(t){const e=A.get(),a=(t.trackIds||[]).filter(i=>e.tracks[i]);if(a.length){const i=e.tracks[a[0]]||{id:a[0]};s.set({queue:a,queueIndex:0,queueContext:t.name,currentTime:0,isPlaying:!0,currentTrack:i})}}function on(t,e){p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{i.target.closest("[data-like]")||sn(a.getAttribute("data-tid"),e,t)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})}),p("[data-like]",t).forEach(a=>{a.addEventListener("click",i=>{i.stopPropagation(),ln(a.getAttribute("data-like"))})})}function sn(t,e,a){const i=p(".trow[data-tid]",a),n=Array.from(i).map(x=>x.getAttribute("data-tid")),o=n.indexOf(t),h=A.get().tracks[t]||{id:t};s.set({queue:n,queueIndex:o,queueContext:e,currentTime:0,isPlaying:!0,currentTrack:h})}function ln(t,e){const{liked:a}=s.get(),i={...a};i[t]?delete i[t]:i[t]=!0,s.set({liked:i})}function cn(t,e){return`
    <div class="trow" data-tid="${t.id}" role="button" tabindex="0" aria-label="Play ${g(t.title)}">
      <span class="n">${String(e+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${t.art||""}"></span>
      <span style="min-width:0"><span class="t">${g(t.title)}</span><span class="s">${g(t.artist)}</span></span>
      <span class="d mono">${dn(t.duration||0)}</span>
      <button class="lk" data-like="${t.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `}function dn(t){if(!isFinite(t)||t<0)return"0:00";const e=Math.max(0,Math.round(t)),a=Math.floor(e/60),i=e%60;return`${a}:${String(i).padStart(2,"0")}`}function pn(t){return`
    <div class="empty" style="text-align:center;padding:60px 20px">
      <b style="font-size:22px;display:block;margin-bottom:8px">${t} not found</b>
      <span style="color:var(--ink-2)">This ${t.toLowerCase()} doesn't exist or has been removed</span>
      <button class="btn line" style="margin-top:24px" onclick="window.location.hash='home'">Go Home</button>
    </div>
  `}function un(){if(document.getElementById("playlistViewStyles"))return;const t=document.createElement("style");t.id="playlistViewStyles",t.textContent=`
    .hero { position: relative; min-height: min(62svh, 560px); display: flex; align-items: center; margin-bottom: 46px; }
    .sec { margin-bottom: 54px; }
    .sec-h { display: flex; align-items: baseline; justify-content: space-between; margin-bottom: 14px; }
    .sec-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(28px, 3.4vw, 44px); line-height: 1; }
    .mosaic { display: grid; grid-template-columns: 1fr 1fr; aspect-ratio: 1; border-radius: 10px; overflow: hidden; }
    .mosaic i { background-size: cover; background-position: center; }
    .mosaic.art { background: var(--paper-2); }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }

    @media (max-width: 860px) {
      .trow { grid-template-columns: 24px 40px 1fr auto; }
      .trow .lk { display: none; }
    }
  `,document.head.appendChild(t)}let b=null,we=null,It=null,Ft=null,Ut=null,qt=null,gt=[],ae=-1,ke=window.matchMedia("(prefers-reduced-motion: reduce)").matches;function hn(){return b=r("div",{id:"landing"},[r("header",{class:"l-nav"},[r("div",{class:"logo"},["DHUN",r("i",{},"धुन")]),r("div",{class:"right"},[r("button",{class:"lnk","data-go":"flow"},"Sound"),r("button",{class:"lnk","data-go":"feat"},"Features"),r("button",{class:"icon-btn","data-theme-toggle":!0,"aria-label":"Switch theme"},d("theme")),r("button",{class:"auth-nav-btn",id:"landingAuthBtn"},"Sign In"),r("a",{class:"btn",href:"#home"},"Open DHUN")])]),r("section",{class:"stage",id:"stage"},[r("div",{class:"stage-in"},[r("div",{class:"rec",id:"rec"},[r("div",{class:"vwrap"},[r("div",{class:"vinyl",id:"lvinyl"},[r("div",{class:"label"},[r("svg",{viewBox:"0 0 24 24",fill:"currentColor"},[r("rect",{x:"3",y:"9",width:"3.4",height:"9",rx:"1"}),r("rect",{x:"8.4",y:"4",width:"3.4",height:"14",rx:"1"}),r("rect",{x:"13.8",y:"7",width:"3.4",height:"11",rx:"1"}),r("rect",{x:"19.2",y:"11",width:"3.4",height:"7",rx:"1"})])])]),r("div",{class:"sheen"})]),r("svg",{class:"ring",viewBox:"0 0 100 100",id:"lring","aria-hidden":"true"},[r("circle",{class:"trk",cx:"50",cy:"50",r:"50"}),r("circle",{class:"arc",cx:"50",cy:"50",r:"50",pathLength:"100",transform:"rotate(-90 50 50)","stroke-dasharray":"0 100"}),r("circle",{class:"knob",r:"1.5"})])]),r("div",{class:"phase p1",id:"p1"},[r("h1",{class:"word","aria-label":"DHUN"},[r("span",{},"D"),r("span",{},"H"),r("span",{},"U"),r("span",{},"N")]),r("p",{class:"word-d",lang:"hi"},"धुन"),r("p",{class:"sub"},"Indie, film, ghazal, lo-fi. Every language you hum in, in one place."),r("div",{class:"row"},[r("a",{class:"btn accent",href:"#home"},"Start listening"),r("span",{class:"mono"},"Free to try. No card.")])]),r("div",{class:"phase p2",id:"p2"},[r("h2",{class:"big"},"Hindi.<br>Tamil.<br>Punjabi.<br><em>Bangla.</em>"),r("p",{class:"note"},"Songs from Mumbai bedrooms, Chennai studios and Kolkata rooftops sit next to each other. Search by language, mood or the line you remember.")]),r("div",{class:"phase p3",id:"p3"},[r("div",{class:"pop-h"},"Popular right now"),r("div",{class:"list",id:"lpop"})]),r("div",{class:"clock",id:"clock"},[r("b",{},"0:00"),r("span",{}," / 3:42")])])]),r("section",{class:"flow",id:"flow"},[r("div",{class:"flow-in"},[r("div",{class:"flow-h"},[r("h2",{},"New this week"),r("p",{},"Keep scrolling to turn the shelf. Tap a cover to play it.")]),r("div",{class:"track",id:"track"}),r("div",{class:"flow-cap"},[r("b",{id:"fcT"},"Sitar Wave"),r("span",{id:"fcS"},"Raag Circuit")])])]),r("section",{class:"feat",id:"feat"},[r("h2",{},"What you get"),r("div",{class:"frow"},[r("h3",{},"The player takes the colour of the cover"),r("p",{},"Open Now Playing and the whole screen glows in the album's palette. Skip a track and the room changes with it.")]),r("div",{class:"frow"},[r("h3",{},"Search by mood and language"),r("p",{},'Type "rain" or pick Tamil. Results group into tracks, artists and albums as you type, with the language shown next to each one.')]),r("div",{class:"frow"},[r("h3",{},"One queue that stays put"),r("p",{},"Browse artists, albums and playlists while the music keeps playing. Add to the queue from any list and see what comes next in one tap.")]),r("div",{class:"frow"},[r("h3",{},"Made to be read, too"),r("p",{},"Large type, plain labels and light and dark themes that hold the same contrast. Everything works on a phone with one thumb.")])]),r("section",{class:"close",id:"close"},[r("h2",{class:"big"},"Press<br>play."),r("div",{style:"display:flex;gap:14px;align-items:center;flex-wrap:wrap"},[r("a",{class:"btn accent",href:"#home"},"Open DHUN"),r("span",{class:"mono",style:"color:var(--ink-2)"},"Works in your browser. Nothing to install.")]),r("div",{class:"foot"},[r("span",{},"DHUN, a tune that stays"),r("span",{},"Hindi, Tamil, Punjabi, Bangla and more")])])]),we=l("#lring",b),It=l("#lvinyl",b),Ft=l("#clock b",b),Ut=l("#track",b),qt=l("#flow",b),gn(),fn(),vn(),mn(),b}function gn(){if(document.getElementById("landingViewStyles"))return;const t=document.createElement("style");t.id="landingViewStyles",t.textContent=`
    /* Landing specific styles */
    #landing { position: relative; }
    .l-nav {
      position: fixed;
      top: env(safe-area-inset-top, 0px);
      left: 0; right: 0; z-index: 20;
      display: flex; align-items: center; justify-content: space-between;
      padding: 18px max(16px, env(safe-area-inset-right, 0px)) 18px var(--gut);
      mix-blend-mode: normal;
    }
    .logo { font-weight: 800; font-stretch: 75%; letter-spacing: -.02em; font-size: 22px; display: flex; align-items: baseline; gap: 8px; }
    .l-nav.on-rec .logo, .l-nav.on-rec .logo i { color: #fff; }
    .logo i { font-style: normal; font-family: var(--deva); font-size: 15px; color: var(--accent); font-weight: 700; }
    .l-nav .right { display: flex; align-items: center; gap: 20px; }
    .l-nav .lnk { font-family: var(--mono); font-size: 12px; text-transform: uppercase; letter-spacing: .06em; }

    .stage { height: 430vh; position: relative; }
    .stage-in { position: sticky; top: 0; height: 100vh; height: 100svh; overflow: hidden; }
    .rec { --S: min(98svh, 64vw); position: absolute; width: var(--S); height: var(--S); left: calc(var(--S)*-.43); top: 50%; margin-top: calc(var(--S)*-.5); }
    .vwrap { position: absolute; inset: 0; }
    .vinyl { position: absolute; inset: 0; border-radius: 50%; background: repeating-radial-gradient(circle at 50% 50%, #0b0b0c 0 2px, #151517 2px 3px), #0b0b0c; will-change: transform; }
    .sheen { position: absolute; inset: 0; border-radius: 50%; pointer-events: none; background: conic-gradient(from 25deg, transparent 0 16%, rgba(255,255,255,.13) 23%, transparent 31% 66%, rgba(255,255,255,.09) 73%, transparent 81%); }
    .label { position: absolute; inset: 34%; border-radius: 50%; background: var(--paper); display: grid; place-items: center; box-shadow: 0 0 0 6px rgba(255,255,255,.05); }
    .label svg { width: 34%; height: 34%; color: var(--accent); }
    .ring { position: absolute; inset: -2.4%; width: 104.8%; height: 104.8%; overflow: visible; }
    .ring .trk { fill: none; stroke: var(--line); stroke-width: .35; }
    .ring .arc { fill: none; stroke: var(--accent); stroke-width: .5; stroke-linecap: round; }
    .ring .knob { fill: var(--accent); stroke: var(--paper); stroke-width: .9; }
    .clock { color: #fff; position: absolute; left: max(16px, env(safe-area-inset-left, 0px)); bottom: max(20px, env(safe-area-inset-bottom, 0px)); font-family: var(--mono); font-size: 13px; }
    .clock b { font-weight: 500; }
    .phase { position: absolute; inset: 0; pointer-events: none; will-change: opacity, transform; }
    .phase > * { pointer-events: auto; }
    .p1 { display: flex; flex-direction: column; justify-content: center; padding-left: calc(var(--S, 0px) + 2vw); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
    .rec ~ .phase { --S: min(98svh, 64vw); }
    .p1 { padding-left: calc(min(98svh, 64vw)*.57 + 4vw); }
    .word { font-weight: 800; font-stretch: 75%; text-transform: uppercase; line-height: .78; letter-spacing: -.045em; font-size: min(23vw, 43svh, 330px); margin: 0; display: flex; }
    .word span { display: inline-block; animation: rise .9s cubic-bezier(.2,.8,.2,1) both; }
    .word span:nth-child(2) { animation-delay: .06s; }
    .word span:nth-child(3) { animation-delay: .12s; }
    .word span:nth-child(4) { animation-delay: .18s; }
    @keyframes rise { from { transform: translateY(40%); opacity: 0; } to { transform: none; opacity: 1; } }
    .word-d { font-family: var(--deva); font-weight: 800; color: var(--accent); font-size: min(12vw, 20svh, 170px); line-height: 1.25; margin: 0 0 0 .04em; }
    .p1 .sub { margin: 18px 0 26px; max-width: 36ch; color: var(--ink-2); font-size: 16px; }
    .p1 .row { display: flex; gap: 14px; align-items: center; flex-wrap: wrap; }
    .p2, .p3 { display: flex; flex-direction: column; justify-content: center; padding-left: calc(min(98svh, 64vw)*.57 + 5vw); padding-right: max(16px, env(safe-area-inset-right, 0px)); }
    .big { font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(10.5vw, 17svh, 150px); margin: 0; }
    .big em { font-style: normal; color: var(--accent); }
    .p2 .note { margin-top: 22px; max-width: 40ch; color: var(--ink-2); }
    .pop-h { font-family: var(--mono); font-size: 13px; color: var(--accent); margin-bottom: 14px; }
    .list { display: flex; flex-direction: column; }
    .trow { display: grid; grid-template-columns: 28px 46px 1fr auto 36px; gap: 14px; align-items: center; padding: 9px 8px; border-radius: 12px; text-align: left; width: 100%; transition: background .15s; }
    .trow:hover { background: color-mix(in srgb, var(--ink) 6%, transparent); }
    .trow .n { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }
    .trow .art { width: 46px; height: 46px; border-radius: 7px; }
    .trow .t { font-family: var(--mono); font-size: 13px; text-transform: uppercase; letter-spacing: .005em; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; display: block; }
    .trow .s { font-family: var(--mono); font-size: 12px; color: var(--ink-2); display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
    .trow .d { font-family: var(--mono); font-size: 12px; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }
    .trow .lk.on { color: var(--accent); }
    .trow.cur .t { color: var(--accent); }
    .eq { display: none; gap: 2px; align-items: flex-end; height: 14px; width: 14px; }
    .eq i { flex: 1; background: var(--accent); animation: eq 1s ease-in-out infinite; height: 40%; }
    .eq i:nth-child(2) { animation-delay: .2s; }
    .eq i:nth-child(3) { animation-delay: .4s; }
    .trow.cur .n { display: none; }
    .trow.cur .eq { display: flex; }
    .playing-off .eq i { animation-play-state: paused; }
    .trow .lk { width: 30px; height: 30px; display: grid; place-items: center; border-radius: 50%; color: var(--ink-2); }
    .trow .lk svg { width: 16px; height: 16px; }

    /* Coverflow */
    .flow { height: 300vh; position: relative; }
    .flow-in { position: sticky; top: 0; height: 100svh; overflow: hidden; display: flex; flex-direction: column; justify-content: center; perspective: 1500px; }
    .flow-h { position: absolute; top: calc(88px + env(safe-area-inset-top, 0px)); left: var(--gut); right: var(--gut); display: flex; justify-content: space-between; align-items: flex-end; gap: 20px; }
    .flow-h h2 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(9vw, 13svh, 120px); }
    .flow-h p { margin: 0; max-width: 26ch; color: var(--ink-2); text-align: right; }
    .track { position: relative; height: min(34vw, 44svh); margin-top: 8svh; transform-style: preserve-3d; }
    .fc { position: absolute; left: 50%; top: 50%; width: min(34vw, 44svh); height: min(34vw, 44svh); margin: calc(min(34vw, 44svh)/-2) 0 0 calc(min(34vw, 44svh)/-2); border-radius: 10px; box-shadow: 0 30px 60px -30px var(--c, #000); cursor: pointer; will-change: transform, opacity; }
    .flow-cap { position: absolute; bottom: max(34px, env(safe-area-inset-bottom, 0px)); left: 0; right: 0; text-align: center; }
    .flow-cap b { display: block; font-weight: 700; font-stretch: 75%; font-size: 28px; letter-spacing: -.02em; }
    .flow-cap span { font-family: var(--mono); font-size: 12px; color: var(--ink-2); }

    /* Features */
    .feat { padding: 14vh var(--gut) 10vh; max-width: 1400px; margin: 0 auto; }
    .feat h2 { margin: 0 0 7vh; font-weight: 700; font-stretch: 75%; letter-spacing: -.035em; line-height: .92; font-size: min(11vw, 150px); }
    .frow { display: grid; grid-template-columns: 1.1fr 1fr; gap: 5vw; padding: 34px 0; border-top: 1px solid var(--line); align-items: start; }
    .frow h3 { margin: 0; font-weight: 700; font-stretch: 75%; letter-spacing: -.03em; font-size: clamp(30px, 4.4vw, 60px); line-height: .98; }
    .frow p { margin: 0; color: var(--ink-2); max-width: 46ch; font-size: 16px; }

    /* Close */
    .close { padding: 12vh var(--gut) 8vh; text-align: left; position: relative; overflow: hidden; min-height: 90svh; display: flex; flex-direction: column; justify-content: flex-end; gap: 32px; }
    .close .big { font-size: min(30vw, 36svh, 420px); line-height: .8; padding-bottom: .14em; }
    .foot { display: flex; justify-content: space-between; gap: 18px; flex-wrap: wrap; font-family: var(--mono); font-size: 12px; color: var(--ink-2); border-top: 1px solid var(--line); padding-top: 18px; }

    /* Mobile */
    @media (max-width: 860px) {
      .l-nav .lnk { display: none; }
      .rec { --S: 150vw; left: -25vw; top: auto; bottom: calc(var(--S)*-.47); margin-top: 0; }
      .rec ~ .phase { --S: 150vw; }
      .p1, .p2, .p3 { padding: calc(76px + env(safe-area-inset-top, 0px)) var(--gut) 0 var(--gut); justify-content: flex-start; }
      .p1 { padding-left: var(--gut); }
      .word { font-size: min(36vw, 26svh); }
      .word-d { font-size: min(19vw, 13svh); }
      .big { font-size: min(17vw, 12svh); }
      .p3 .trow { grid-template-columns: 24px 40px 1fr auto; }
      .p3 .trow .lk { display: none; }
      .clock { left: auto; right: var(--gut); bottom: max(14px, env(safe-area-inset-bottom, 0px)); }
      .flow-h { flex-direction: column; align-items: flex-start; }
      .flow-h p { text-align: left; }
      .track { height: 62vw; }
      .fc { width: 58vw; height: 58vw; margin: -29vw 0 0 -29vw; }
      .frow { grid-template-columns: 1fr; gap: 12px; }
    }
  `,document.head.appendChild(t)}function fn(){const t=l("#landingAuthBtn",b);if(t){const e=a=>{var o,c;const{isAuthenticated:i,user:n}=a;if(i&&n){const h=((o=n.user_metadata)==null?void 0:o.display_name)||((c=n.email)==null?void 0:c.split("@")[0])||"Member";t.textContent=h,t.title="Account"}else t.textContent="Sign In",t.title="Sign In"};t.addEventListener("click",()=>{const{isAuthenticated:a}=$.get();a?E("home"):J("login")}),$.subscribe(e),e($.get())}p("[data-go]",b).forEach(e=>{e.addEventListener("click",()=>{const a=e.getAttribute("data-go"),i=l(`#${a}`,b);i&&window.scrollTo({top:i.offsetTop,behavior:ke?"auto":"smooth"})})}),p("[data-theme-toggle]",b).forEach(e=>{e.addEventListener("click",()=>{const a=document.documentElement,i=a.getAttribute("data-theme"),n=window.matchMedia("(prefers-color-scheme: dark)").matches,c=i==="dark"||!i&&n?"light":"dark";a.setAttribute("data-theme",c),localStorage.setItem("dhun-theme",c)})}),window.addEventListener("scroll",ct,{passive:!0}),window.addEventListener("resize",ct)}function mn(){const t=l("#lpop",b);if(!t)return;const e=[{id:"t0-0",title:"Neon Bhairavi",artist:"Raag Circuit",art:"",duration:252},{id:"t1-0",title:"Baarish Ke Baad",artist:"Meera & The Monsoon",art:"",duration:211},{id:"t5-0",title:"Backwater Blues",artist:"Dev Nair Quartet",art:"",duration:322},{id:"t3-1",title:"Dil Ka DM",artist:"Kavya Sethi",art:"",duration:199}];t.innerHTML=e.map((a,i)=>`
    <div class="trow" data-tid="${a.id}" role="button" tabindex="0" aria-label="Play ${a.title}">
      <span class="n">${String(i+1).padStart(2,"0")}</span>
      <span class="eq"><i></i><i></i><i></i></span>
      <span class="art cover" style="background-image:${a.art||"var(--paper-2)"}"></span>
      <span style="min-width:0"><span class="t">${a.title}</span><span class="s">${a.artist}</span></span>
      <span class="d mono">${Ee(a.duration)}</span>
      <button class="lk" data-like="${a.id}" aria-label="Like">${d("heart")}</button>
    </div>
  `).join(""),p(".trow",t).forEach(a=>{a.addEventListener("click",i=>{if(i.target.closest("[data-like]"))return;const n=a.getAttribute("data-tid");E("home"),sessionStorage.setItem("dhun-autoplay",n)}),a.addEventListener("keydown",i=>{(i.key==="Enter"||i.key===" ")&&(i.preventDefault(),a.click())})})}function vn(){[{id:"al0",title:"Sitar Wave",artist:"Raag Circuit",year:2025,art:"",glow:"#F25C2A"},{id:"al1",title:"Monsoon Letters",artist:"Meera & The Monsoon",year:2024,art:"",glow:"#E8A33D"},{id:"al2",title:"Slow Sunday",artist:"Tanpura Club",year:2025,art:"",glow:"#7A2E4B"},{id:"al3",title:"Hinglish Hearts",artist:"Kavya Sethi",year:2026,art:"",glow:"#2D1E5F"},{id:"al4",title:"Blue Hour",artist:"Nilgiri Hours",year:2024,art:"",glow:"#13A89E"},{id:"al5",title:"Kerala Standard Time",artist:"Dev Nair Quartet",year:2025,art:"",glow:"#C5E063"},{id:"al6",title:"Zero Night",artist:"Raag Circuit",year:2023,art:"",glow:"#E23B2E"},{id:"al7",title:"Open Windows",artist:"Kavya Sethi",year:2023,art:"",glow:"#FAA43A"}].forEach((e,a)=>{const i=r("button",{class:"fc cover",style:`background-image:${e.art||"var(--paper-2)"};--c:${e.glow}`,"aria-label":`${e.title} by ${e.artist}`});i.addEventListener("click",()=>E(`album-${e.id}`)),Ut.appendChild(i),gt.push(i)})}function ct(){var n;if(b!=null&&b.hidden)return;const t=l("#stage",b);if(!t)return;const e=t.offsetHeight-innerHeight,a=Math.min(1,Math.max(0,-t.getBoundingClientRect().top/e));xn(we,a);const i=t.getBoundingClientRect();(n=l(".l-nav",b))==null||n.classList.toggle("on-rec",innerWidth>860&&i.top<=0&&i.bottom>60),It&&(It.style.transform=`rotate(${ke?0:a*1080}deg)`),Ft&&(Ft.textContent=Ee(a*222)),kt(l("#p1",b),wt(a,-1,0,.2,.29),-1),kt(l("#p2",b),wt(a,.27,.37,.55,.64),1),kt(l("#p3",b),wt(a,.62,.72,1.2,1.3),1),bn()}function wt(t,e,a,i,n){return t<a?Math.min(1,Math.max(0,(t-e)/(a-e))):t<=i?1:Math.min(1,Math.max(0,1-(t-i)/(n-i)))}function kt(t,e,a){t&&(t.style.opacity=e,t.style.transform=`translate3d(0,${(1-e)*a*26}px,0)`,t.style.visibility=e<.01?"hidden":"visible",t.style.pointerEvents=e>.6?"auto":"none")}function xn(t,e){if(!t)return;const a=l(".arc",t),i=l(".knob",t);a.setAttribute("stroke-dasharray",`${Math.min(1,Math.max(0,e))*100} 100`);const n=e*Math.PI*2-Math.PI/2;i.setAttribute("cx",50+50*Math.cos(n)),i.setAttribute("cy",50+50*Math.sin(n))}function bn(){var x;const t=qt.getBoundingClientRect(),e=qt.offsetHeight-innerHeight,a=Math.min(1,Math.max(0,-t.top/e));if(t.bottom<-50||t.top>innerHeight+50)return;const i=a*(gt.length-1),n=Ut.offsetWidth,o=((x=gt[0])==null?void 0:x.offsetWidth)||300,c=Math.min(o*.7,n*.22);gt.forEach((y,w)=>{const S=w-i,P=Math.abs(S),M=Math.min(62,Math.max(-62,S*-52)),C=-Math.min(P,3)*90,N=1-Math.min(P,3)*.07,B=1-Math.min(P,3.6)*.24,Q=S*c+(S>0?o*.3:S<0?-o*.3:0)*Math.min(P,1);y.style.transform=`translate3d(${Q}px,0,${C}px) rotateY(${M}deg) scale(${N})`,y.style.opacity=B,y.style.zIndex=100-Math.round(P*10)});const h=Math.round(i);if(h!==ae){ae=h;const y=[{title:"Sitar Wave",artist:"Raag Circuit",year:2025}][h]||{};l("#fcT",b).textContent=y.title||"Sitar Wave",l("#fcS",b).textContent=`${y.artist||"Raag Circuit"} · ${y.year||2025}`}}function Ee(t){return t=Math.max(0,Math.round(t)),Math.floor(t/60)+":"+String(t%60).padStart(2,"0")}function yn(){b&&(b.hidden=!1,window.addEventListener("scroll",ct,{passive:!0}),ct())}function wn(){b&&(b.hidden=!0,window.removeEventListener("scroll",ct))}const R={landing:null,home:null,search:null,library:null,artist:null,album:null,playlist:null};let et=null;async function kn(){Le(),Se();const t=document.getElementById("landing-root"),e=document.getElementById("app");oe();const a=Ea(),i=Ca(),n=Oe(),o=de();document.body.appendChild(o),et=r("main",{class:"main",id:"main"}),e.innerHTML="",e.appendChild(a),e.appendChild(et),e.appendChild(i),e.appendChild(n),R.landing=hn(),R.home=Ta(),R.search=Ya(),R.library=ii(),R.artist=ki(),R.album=Hi(),R.playlist=Xi(),t.innerHTML="",t.appendChild(R.landing),En(),Pe(),Sn(),await Mn(),Cn(),Ln(),An(),console.log("DHUN initialized successfully")}function En(){H("landing",()=>$n()),H("home",()=>Z("home",Ba)),H("search",()=>Z("search",Ja)),H("library",()=>Z("library",Ot)),H("artist",t=>Z("artist",()=>Ei(t))),H("album",t=>Z("album",()=>ji(t))),H("playlist",t=>Z("playlist",()=>Zi(t))),H("playing",()=>ka()),H("login",()=>J("login")),H("signup",()=>J("signup")),H("forgot",()=>J("forgot"))}function $n(){const t=document.getElementById("landing-root"),e=document.getElementById("app");t&&(t.hidden=!1),e&&(e.hidden=!0),yn(),document.body.style.overflow=""}function Z(t,e){const a=document.getElementById("landing-root"),i=document.getElementById("app");if(a&&(a.hidden=!0),wn(),i&&(i.hidden=!1),document.body.style.overflow="hidden",et){et.innerHTML="";const n=R[t];n&&(et.appendChild(n),e&&e()),et.scrollTop=0}}function An(){setInterval(()=>{const{isPlaying:t,currentTime:e,duration:a,queue:i,queueIndex:n}=s.get();if(!t||n<0||!i.length)return;const o=i[n],c=a||(typeof o=="object"?o.duration:240)||240,h=e+.25;h>=c?$e():s.set({currentTime:h,duration:c})},250)}async function Mn(){if(location.hash.includes("access_token="))try{await at.handleOAuthCallback(location.hash),history.replaceState(null,"",location.pathname+location.search),zt("Signed in with Google!"),E("home")}catch(t){console.error("OAuth callback failed:",t),zt("Sign in failed: "+t.message,"error")}}function Cn(){const t={"raag-circuit":{id:"raag-circuit",name:"Raag Circuit",genres:"Electronic raga, downtempo, sitar wave",listeners:"2.4M monthly listeners",art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"meera-monsoon":{id:"meera-monsoon",name:"Meera & The Monsoon",genres:"Indie folk, Hindi pop, acoustic",listeners:"1.8M monthly listeners",art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D"},"tanpura-club":{id:"tanpura-club",name:"Tanpura Club",genres:"Lo-fi, ambient, classical fusion",listeners:"960K monthly listeners",art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B"},"kavya-sethi":{id:"kavya-sethi",name:"Kavya Sethi",genres:"Pop, R&B, Hinglish",listeners:"3.1M monthly listeners",art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F"},"nilgiri-hours":{id:"nilgiri-hours",name:"Nilgiri Hours",genres:"Indie rock, shoegaze, Tamil",listeners:"740K monthly listeners",art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E"},"dev-nair-quartet":{id:"dev-nair-quartet",name:"Dev Nair Quartet",genres:"Jazz, Malayalam fusion",listeners:"410K monthly listeners",art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063"}},e={al0:{id:"al0",title:"Sitar Wave",artist:"Raag Circuit",artistId:"raag-circuit",year:2025,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A",trackIds:["t0-0","t0-1","t0-2","t0-3","t0-4"]},al1:{id:"al1",title:"Monsoon Letters",artist:"Meera & The Monsoon",artistId:"meera-monsoon",year:2024,art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D",trackIds:["t1-0","t1-1","t1-2","t1-3"]},al2:{id:"al2",title:"Slow Sunday",artist:"Tanpura Club",artistId:"tanpura-club",year:2025,art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B",trackIds:["t2-0","t2-1","t2-2","t2-3"]},al3:{id:"al3",title:"Hinglish Hearts",artist:"Kavya Sethi",artistId:"kavya-sethi",year:2026,art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F",trackIds:["t3-0","t3-1","t3-2","t3-3"]},al4:{id:"al4",title:"Blue Hour",artist:"Nilgiri Hours",artistId:"nilgiri-hours",year:2024,art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E",trackIds:["t4-0","t4-1","t4-2","t4-3"]},al5:{id:"al5",title:"Kerala Standard Time",artist:"Dev Nair Quartet",artistId:"dev-nair-quartet",year:2025,art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063",trackIds:["t5-0","t5-1","t5-2","t5-3"]},al6:{id:"al6",title:"Zero Night",artist:"Raag Circuit",artistId:"raag-circuit",year:2023,art:u("stripes",["#111114","#E23B2E","#EBEBE6"]),glow:"#E23B2E",trackIds:["t6-0","t6-1","t6-2"]},al7:{id:"al7",title:"Open Windows",artist:"Kavya Sethi",artistId:"kavya-sethi",year:2023,art:u("sun",["#0D3B66","#FAA43A","#F4D35E"]),glow:"#FAA43A",trackIds:["t7-0","t7-1","t7-2"]}},a={"t0-0":{id:"t0-0",title:"Neon Bhairavi",artist:"Raag Circuit",artistId:"raag-circuit",album:"Sitar Wave",albumId:"al0",duration:252,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"t0-1":{id:"t0-1",title:"Midnight Kalyan",artist:"Raag Circuit",artistId:"raag-circuit",album:"Sitar Wave",albumId:"al0",duration:228,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"t0-2":{id:"t0-2",title:"Tabla Drift",artist:"Raag Circuit",artistId:"raag-circuit",album:"Sitar Wave",albumId:"al0",duration:301,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"t0-3":{id:"t0-3",title:"Raga in Rain",artist:"Raag Circuit",artistId:"raag-circuit",album:"Sitar Wave",albumId:"al0",duration:216,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"t0-4":{id:"t0-4",title:"Last Local",artist:"Raag Circuit",artistId:"raag-circuit",album:"Sitar Wave",albumId:"al0",duration:260,art:u("sun",["#1B1464","#F25C2A","#FFD25E"]),glow:"#F25C2A"},"t1-0":{id:"t1-0",title:"Baarish Ke Baad",artist:"Meera & The Monsoon",artistId:"meera-monsoon",album:"Monsoon Letters",albumId:"al1",duration:211,art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D"},"t1-1":{id:"t1-1",title:"Chai at 3 AM",artist:"Meera & The Monsoon",artistId:"meera-monsoon",album:"Monsoon Letters",albumId:"al1",duration:178,art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D"},"t1-2":{id:"t1-2",title:"Chitthi",artist:"Meera & The Monsoon",artistId:"meera-monsoon",album:"Monsoon Letters",albumId:"al1",duration:245,art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D"},"t1-3":{id:"t1-3",title:"Kaagaz Ki Naav",artist:"Meera & The Monsoon",artistId:"meera-monsoon",album:"Monsoon Letters",albumId:"al1",duration:202,art:u("arch",["#0F3D3E","#E8A33D","#F4E3C1"]),glow:"#E8A33D"},"t2-0":{id:"t2-0",title:"Dhoop Chhaon",artist:"Tanpura Club",artistId:"tanpura-club",album:"Slow Sunday",albumId:"al2",duration:194,art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B"},"t2-1":{id:"t2-1",title:"Sunday Raga",artist:"Tanpura Club",artistId:"tanpura-club",album:"Slow Sunday",albumId:"al2",duration:280,art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B"},"t2-2":{id:"t2-2",title:"Humming Fan",artist:"Tanpura Club",artistId:"tanpura-club",album:"Slow Sunday",albumId:"al2",duration:167,art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B"},"t2-3":{id:"t2-3",title:"Neend",artist:"Tanpura Club",artistId:"tanpura-club",album:"Slow Sunday",albumId:"al2",duration:309,art:u("rings",["#F2C6D0","#7A2E4B","#2B2A4C"]),glow:"#7A2E4B"},"t3-0":{id:"t3-0",title:"Textuals",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Hinglish Hearts",albumId:"al3",duration:176,art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F"},"t3-1":{id:"t3-1",title:"Dil Ka DM",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Hinglish Hearts",albumId:"al3",duration:199,art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F"},"t3-2":{id:"t3-2",title:"Chal Na",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Hinglish Hearts",albumId:"al3",duration:183,art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F"},"t3-3":{id:"t3-3",title:"Rooftop Wifi",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Hinglish Hearts",albumId:"al3",duration:221,art:u("blocks",["#FF5A7A","#2D1E5F","#FFD1DC"]),glow:"#2D1E5F"},"t4-0":{id:"t4-0",title:"Kohra",artist:"Nilgiri Hours",artistId:"nilgiri-hours",album:"Blue Hour",albumId:"al4",duration:273,art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E"},"t4-1":{id:"t4-1",title:"Tea Estate",artist:"Nilgiri Hours",artistId:"nilgiri-hours",album:"Blue Hour",albumId:"al4",duration:237,art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E"},"t4-2":{id:"t4-2",title:"Ooty Static",artist:"Nilgiri Hours",artistId:"nilgiri-hours",album:"Blue Hour",albumId:"al4",duration:258,art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E"},"t4-3":{id:"t4-3",title:"Saanjh",artist:"Nilgiri Hours",artistId:"nilgiri-hours",album:"Blue Hour",albumId:"al4",duration:209,art:u("stripes",["#0B2545","#13A89E","#EEF4ED"]),glow:"#13A89E"},"t5-0":{id:"t5-0",title:"Backwater Blues",artist:"Dev Nair Quartet",artistId:"dev-nair-quartet",album:"Kerala Standard Time",albumId:"al5",duration:322,art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063"},"t5-1":{id:"t5-1",title:"Sadhya",artist:"Dev Nair Quartet",artistId:"dev-nair-quartet",album:"Kerala Standard Time",albumId:"al5",duration:251,art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063"},"t5-2":{id:"t5-2",title:"Kathakali Swing",artist:"Dev Nair Quartet",artistId:"dev-nair-quartet",album:"Kerala Standard Time",albumId:"al5",duration:232,art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063"},"t5-3":{id:"t5-3",title:"Monsoon Waltz",artist:"Dev Nair Quartet",artistId:"dev-nair-quartet",album:"Kerala Standard Time",albumId:"al5",duration:362,art:u("arch",["#143A2B","#C5E063","#F4F1DE"]),glow:"#C5E063"},"t6-0":{id:"t6-0",title:"Subah 4 AM",artist:"Raag Circuit",artistId:"raag-circuit",album:"Zero Night",albumId:"al6",duration:214,art:u("stripes",["#111114","#E23B2E","#EBEBE6"]),glow:"#E23B2E"},"t6-1":{id:"t6-1",title:"Tandoor Techno",artist:"Raag Circuit",artistId:"raag-circuit",album:"Zero Night",albumId:"al6",duration:243,art:u("stripes",["#111114","#E23B2E","#EBEBE6"]),glow:"#E23B2E"},"t6-2":{id:"t6-2",title:"Metro Mantra",artist:"Raag Circuit",artistId:"raag-circuit",album:"Zero Night",albumId:"al6",duration:229,art:u("stripes",["#111114","#E23B2E","#EBEBE6"]),glow:"#E23B2E"},"t7-0":{id:"t7-0",title:"Gali Ke Lights",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Open Windows",albumId:"al7",duration:188,art:u("sun",["#0D3B66","#FAA43A","#F4D35E"]),glow:"#FAA43A"},"t7-1":{id:"t7-1",title:"Ek Aur Chai",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Open Windows",albumId:"al7",duration:205,art:u("sun",["#0D3B66","#FAA43A","#F4D35E"]),glow:"#FAA43A"},"t7-2":{id:"t7-2",title:"Pause",artist:"Kavya Sethi",artistId:"kavya-sethi",album:"Open Windows",albumId:"al7",duration:172,art:u("sun",["#0D3B66","#FAA43A","#F4D35E"]),glow:"#FAA43A"}},i=["t0-0","t1-0","t5-0","t3-1","t4-0","t2-1","t0-3","t6-1"],n={baarish:{id:"baarish",name:"Baarish Mood",trackIds:["t1-0","t0-3","t5-3","t1-3","t2-0","t4-1"]},"night-drive":{id:"night-drive",name:"Late Night Drive",trackIds:["t0-0","t6-0","t6-1","t0-1","t4-0","t3-0"]},chai:{id:"chai",name:"Chai & Chill",trackIds:["t1-1","t7-1","t2-3","t1-2","t3-2"]},focus:{id:"focus",name:"Focus Dhun",trackIds:["t2-1","t2-2","t4-3","t0-2","t5-1"]},gym:{id:"gym",name:"Gym Ke Baad",trackIds:["t6-2","t3-0","t0-0","t7-0","t6-1"]}};A.set({artists:t,albums:e,tracks:a,playlists:n,featuredArtist:t["raag-circuit"],newAlbums:Object.values(e).slice(0,6),popularTracks:i.map(o=>a[o]),artistsList:Object.values(t)})}function u(t,e){const a=e[0],i=e[1],n=e[2];let o="";t==="sun"?o=`<rect width="200" height="200" fill="${a}"/><circle cx="100" cy="92" r="58" fill="${i}"/><rect y="118" width="200" height="82" fill="${a}"/><circle cx="100" cy="92" r="32" fill="${n}"/><rect y="132" width="200" height="6" fill="${i}"/><rect y="148" width="200" height="4" fill="${i}"/>`:t==="arch"?o=`<rect width="200" height="200" fill="${a}"/><path d="M30 200V96a70 70 0 0 1 140 0v104z" fill="${i}"/><path d="M60 200V98a40 40 0 0 1 80 0v102z" fill="${n}"/><circle cx="100" cy="94" r="14" fill="${a}"/>`:t==="rings"?o=`<rect width="200" height="200" fill="${a}"/><circle cx="70" cy="130" r="120" fill="${i}"/><circle cx="70" cy="130" r="88" fill="${a}"/><circle cx="70" cy="130" r="56" fill="${n}"/><circle cx="70" cy="130" r="24" fill="${i}"/>`:t==="blocks"?o=`<rect width="200" height="200" fill="${a}"/><path d="M0 100a100 100 0 0 1 100-100v100z" fill="${i}"/><path d="M200 100a100 100 0 0 1-100 100V100z" fill="${n}"/><circle cx="150" cy="50" r="38" fill="${n}"/><circle cx="50" cy="150" r="38" fill="${i}"/>`:o=`<rect width="200" height="200" fill="${a}"/><g fill="none" stroke-width="16"><circle cx="40" cy="-10" r="60" stroke="${i}"/><circle cx="40" cy="-10" r="90" stroke="${n}"/><circle cx="40" cy="-10" r="120" stroke="${i}"/><circle cx="40" cy="-10" r="150" stroke="${n}"/><circle cx="40" cy="-10" r="180" stroke="${i}"/><circle cx="40" cy="-10" r="210" stroke="${n}"/></g>`;const c=`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" preserveAspectRatio="xMidYMid slice">${o}</svg>`;return`url('data:image/svg+xml,${encodeURIComponent(c).replace(/'/g,"%27")}')`}function Ln(){const t=JSON.parse(localStorage.getItem("dhun-player")||"{}");t&&t.queue&&s.set(t)}function Sn(){document.addEventListener("click",t=>{t.target.closest("[data-theme-toggle]")&&Ce()}),document.addEventListener("keydown",t=>{if(t.target.tagName==="INPUT"||t.target.tagName==="TEXTAREA")return;const e=s.get();if(t.code==="Space")t.preventDefault(),s.set({isPlaying:!e.isPlaying});else if(t.key==="ArrowRight")t.shiftKey?$e():ie(10);else if(t.key==="ArrowLeft")t.shiftKey?Tn():ie(-10);else if(t.key==="Escape"){const a=document.getElementById("np");a&&!a.hidden&&Rt()}}),window.addEventListener("resize",()=>{L.set({isMobile:window.innerWidth<=860})})}function $e(){const{queue:t,queueIndex:e,shuffle:a,repeat:i}=s.get();if(!t.length)return;let n=e;if(a&&t.length>1)do n=Math.floor(Math.random()*t.length);while(n===e&&t.length>1);else if(e<t.length-1)n++;else if(i===1)n=0;else{s.set({isPlaying:!1,currentTime:0});return}s.set({queueIndex:n,currentTime:0,isPlaying:!0})}function Tn(){const{queue:t,queueIndex:e,currentTime:a}=s.get();t.length&&(a>3?s.set({currentTime:0}):e>0?s.set({queueIndex:e-1,currentTime:0}):s.set({queueIndex:t.length-1,currentTime:0}))}function ie(t){const{currentTime:e,duration:a}=s.get();if(!a)return;const i=Math.max(0,Math.min(a,e+t));s.set({currentTime:i})}function zt(t,e="info"){const a=r("div",{class:`toast toast-${e}`},t);document.body.appendChild(a),a.offsetHeight,a.classList.add("show"),setTimeout(()=>{a.classList.remove("show"),setTimeout(()=>a.remove(),200)},3e3)}if(!document.getElementById("toastStyles")){const t=document.createElement("style");t.id="toastStyles",t.textContent=`
    .toast { position: fixed; bottom: 100px; left: 50%; transform: translateX(-50%) translateY(100px); padding: 12px 24px; background: var(--ink); color: var(--paper); border-radius: 999px; font-weight: 500; font-size: 14px; z-index: 200; opacity: 0; transition: transform .3s, opacity .3s; box-shadow: 0 12px 24px -12px rgba(0,0,0,.3); }
    .toast.show { transform: translateX(-50%) translateY(0); opacity: 1; }
    .toast-success { background: #2E7D32; }
    .toast-error { background: var(--accent); }
    @media (max-width: 480px) { .toast { left: 16px; right: 16px; transform: none; bottom: 90px; text-align: center; } .toast.show { transform: translateY(0); } }
  `,document.head.appendChild(t)}window.DHUN={stores:{authStore:$,playerStore:s,uiStore:L,libraryStore:D,musicStore:A},navigate:E,openAuthModal:J,showToast:zt};kn();
