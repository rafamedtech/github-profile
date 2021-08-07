// DarkMode Button
const switchElement = document.querySelector('.switch');

switchElement.addEventListener('click', () => {
  document.body.classList.toggle('dark');
});

//Fetch Data and Dom Manipulation

const APIURL = 'https://api.github.com/users/';

const main = document.getElementById('main');
const form = document.getElementById('form');
const search = document.getElementById('search');

async function getUser(username) {
  try {
    const { data } = await axios(APIURL + username);

    createUserCard(data);
    setTimeout(getRepos(username), 2500);
  } catch (err) {
    if (err.response.status == 404) {
      createErrorCard('No profile with this username');
    }
  }
}

async function getRepos(username) {
  try {
    const { data } = await axios(APIURL + username + '/repos?sort=created');

    addReposToCard(data);
  } catch (err) {
    createErrorCard('Problem fetching repos');
  }
}

function createUserCard(user) {
  const cardHTML = /* html */ `
    <div data-aos="fade-in" data-aos-duration="1000"  class="card">
        <div>
          <img
            src="${user.avatar_url}"
            alt=""
            class="avatar"
          />
        </div>
        <div class="user-info">
          <h2>${user.name}</h2>
          <p>
            ${user.bio}
          </p>
          <ul>
            <li>${user.followers} <strong>Followers</strong></li>
            <li>${user.following} <strong>Following</strong></li>
            <li>${user.public_repos} <strong>Repos</strong></li>
          </ul>

          <div id="repos">
            <a class="animated-bg animated-bg-text">&nbsp;</a>
            <a class="animated-bg animated-bg-text">&nbsp;</a>
            <a class="animated-bg animated-bg-text">&nbsp;</a>
            <a class="animated-bg animated-bg-text">&nbsp;</a>
            <a class="animated-bg animated-bg-text">&nbsp;</a>
          </div>
        </div>
      </div>`;

  main.innerHTML = cardHTML;
}

function createErrorCard(msg) {
  const cardHTML = /* html */ `
     <div class="card">
        <h1>${msg}</h1>
     </div>
                `;

  main.innerHTML = cardHTML;
}

function addReposToCard(repos) {
  const reposEl = document.getElementById('repos');
  reposEl.innerHTML = '';

  repos.slice(0, 5).forEach((repo) => {
    const repoEl = document.createElement('a');
    repoEl.classList.add('repo');
    repoEl.classList.remove('animated-bg');
    repoEl.classList.remove('animated-bg-text');
    repoEl.href = repo.html_url;
    repoEl.target = '_blank';
    repoEl.innerText = repo.name;

    reposEl.appendChild(repoEl);
  });
}

form.addEventListener('submit', (e) => {
  e.preventDefault();

  const user = search.value;

  if (user) {
    getUser(user);

    search.value = '';
  }
});
