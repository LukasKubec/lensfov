import './style.css'

type SensorSpec = {
  id: string
  label: string
  width: number
  height: number
  isCustom?: boolean
}

type AngleOfView = {
  focal: number
  horizontal: number
  vertical: number
  diagonal: number
}

type LensMetrics = AngleOfView & {
  frameWidthMeters: number
  subjectsAcross: number
}

type SubjectSpec = {
  id: string
  label: string
  widthMeters: number
  singular: string
  plural: string
  icon: string
}

const SENSOR_OPTIONS: SensorSpec[] = [
  { id: 'full-frame', label: 'Full Frame (36 x 24 mm)', width: 36, height: 24 },
  { id: 'aps-c', label: 'APS-C (23.6 x 15.7 mm)', width: 23.6, height: 15.7 },
  { id: 'custom', label: 'Custom sensor...', width: 0, height: 0, isCustom: true },
]

const SUBJECT_OPTIONS: SubjectSpec[] = [
  {
    id: 'people',
    label: 'People (~0.55 m)',
    widthMeters: 0.55,
    singular: 'person',
    plural: 'people',
    icon: `
      <svg class="subject-icon" viewBox="0 0 24 48" aria-hidden="true">
        <circle cx="12" cy="8" r="6" fill="currentColor" />
        <path d="M12 18c5 0 9 4 9 9v9h-5v-9c0-2.2-1.8-4-4-4s-4 1.8-4 4v9H3v-9c0-5 4-9 9-9z" fill="currentColor" />
        <path d="M7 45l2-12h6l2 12H7z" fill="currentColor" />
      </svg>
    `,
  },
  {
    id: 'car',
    label: 'Car (~1.9 m)',
    widthMeters: 1.9,
    singular: 'car',
    plural: 'cars',
    icon: `
      <svg class="subject-icon" viewBox="0 0 64 36" aria-hidden="true">
        <path d="M10 18l6-8c1.2-1.6 3-2.5 5-2.5h22c2 0 3.8 0.9 5 2.5l6 8z" fill="currentColor" />
        <rect x="6" y="18" width="52" height="10" rx="4" fill="currentColor" />
        <circle cx="20" cy="28" r="4" fill="#ffffff" />
        <circle cx="44" cy="28" r="4" fill="#ffffff" />
      </svg>
    `,
  },
  {
    id: 'yoda',
    label: 'Yoda (~0.45 m)',
    widthMeters: 0.45,
    singular: 'Yoda',
    plural: 'Yodas',
    icon: `
      <svg class="subject-icon" viewBox="0 0 48 40" aria-hidden="true">
        <path d="M6 16l-6-6 10-4 8 4 6-4 6 4 8-4 10 4-6 6" opacity="0.75" fill="currentColor" />
        <path d="M12 18c0 8 6 14 12 14s12-6 12-14z" fill="currentColor" />
        <rect x="18" y="26" width="12" height="10" fill="currentColor" />
      </svg>
    `,
  },
  {
    id: 'banana',
    label: 'Banana (~0.18 m)',
    widthMeters: 0.18,
    singular: 'banana',
    plural: 'bananas',
    icon: `
      <svg class="subject-icon" viewBox="0 0 48 32" aria-hidden="true">
        <path d="M6 6c2 14 16 23 32 24-3 3-7 4-11 4C16 34 7 27 6 14z" fill="currentColor" />
      </svg>
    `,
  },
  {
    id: 'soccer-field',
    label: 'Soccer / football field (~68 m)',
    widthMeters: 68,
    singular: 'field',
    plural: 'fields',
    icon: `
      <svg class="subject-icon" viewBox="0 0 80 40" aria-hidden="true">
        <rect x="4" y="4" width="72" height="32" rx="4" ry="4" fill="none" stroke="currentColor" stroke-width="4" />
        <line x1="40" y1="4" x2="40" y2="36" stroke="currentColor" stroke-width="2" />
        <circle cx="40" cy="20" r="7" fill="none" stroke="currentColor" stroke-width="2" />
      </svg>
    `,
  },
]

const appRoot = document.querySelector<HTMLDivElement>('#app')

if (!appRoot) {
  throw new Error('Application root element not found')
}

appRoot.innerHTML = `
  <div class="layout">
    <header>
      <h1>Angle of View Calculator</h1>
      <p class="intro">
        Enter one or more focal lengths (e.g. <code>35mm, 50</code>) to compare their angles of view for the selected sensor size.
      </p>
    </header>

    <form class="controls" id="calculator-form">
      <label for="focal-input">Focal length (mm)</label>
      <input
        id="focal-input"
        name="focal-input"
        type="text"
        placeholder="35, 50, 85mm"
        autocomplete="off"
      />

      <fieldset class="sensor-options">
        <legend>Sensor format</legend>
        <div class="sensor-options-grid">
          ${SENSOR_OPTIONS.map(
            (option, index) => `
              <label class="sensor-option">
                <input
                  type="radio"
                  name="sensor-option"
                  value="${option.id}"
                  ${index === 0 ? 'checked' : ''}
                />
                <span>${option.label.replace(' ', '<br />')}</span>
              </label>
            `,
          ).join('')}
        </div>
        <div id="custom-sensor" class="custom-sensor" hidden>
         <div>
           <label for="sensor-width">Sensor width (mm)</label>
           <input id="sensor-width" name="sensor-width" type="number" min="1" step="0.1" />
         </div>
        <div>
          <label for="sensor-height">Sensor height (mm)</label>
          <input id="sensor-height" name="sensor-height" type="number" min="1" step="0.1" />
        </div>
      </div>
      </fieldset>

      <label for="distance-input">Subject distance (m)</label>
      <input
        id="distance-input"
        name="distance-input"
        type="number"
        min="0.5"
        step="0.5"
        value="10"
      />

      <label for="subject-select">Subject type</label>
      <select id="subject-select" name="subject-select">
        ${SUBJECT_OPTIONS.map((option) => `<option value="${option.id}">${option.label}</option>`).join('')}
      </select>



      <button type="submit">Calculate</button>
      <p class="note">Values update automatically; the button is there for keyboard users.</p>
    </form>

    <section class="messages" id="messages" aria-live="polite"></section>

    <section class="overlay-hero" id="overlay-hero" >
      <h2>Layered field of view</h2>
      <p class="overlay-copy">See how focal lengths overlap and how many subjects fit across the frame at the chosen distance.</p>
      <div id="chart-overlay" class="overlay" role="img" aria-label="Layered angle of view comparison"></div>
    </section>

    <section class="results" id="results"></section>

    <section class="visualisation" id="visualisation">
      <h2>Field of view comparison</h2>
      <div class="visual-panels">
        <div class="panel">
          <h3>Relative width</h3>
          <div id="chart-bars" class="chart" role="img" aria-label="Field of view bar chart"></div>
        </div>
      </div>
    </section>
  </div>
`

const form = appRoot.querySelector<HTMLFormElement>('#calculator-form')
const focalInput = appRoot.querySelector<HTMLInputElement>('#focal-input')
const sensorOptionInputs = Array.from(
  appRoot.querySelectorAll<HTMLInputElement>('input[name="sensor-option"]'),
)
const customSensorContainer = appRoot.querySelector<HTMLDivElement>('#custom-sensor')
const customWidthInput = appRoot.querySelector<HTMLInputElement>('#sensor-width')
const customHeightInput = appRoot.querySelector<HTMLInputElement>('#sensor-height')
const distanceInput = appRoot.querySelector<HTMLInputElement>('#distance-input')
const subjectSelect = appRoot.querySelector<HTMLSelectElement>('#subject-select')
const resultsContainer = appRoot.querySelector<HTMLDivElement>('#results')
const messagesContainer = appRoot.querySelector<HTMLDivElement>('#messages')
const barChartContainer = appRoot.querySelector<HTMLDivElement>('#chart-bars')
const overlayContainer = appRoot.querySelector<HTMLDivElement>('#chart-overlay')
const overlayHero = appRoot.querySelector<HTMLElement>('#overlay-hero')
const visualisationSection = appRoot.querySelector<HTMLElement>('#visualisation')

if (
  !form ||
  !focalInput ||
  sensorOptionInputs.length === 0 ||
  !customSensorContainer ||
  !customWidthInput ||
  !customHeightInput ||
  !distanceInput ||
  !subjectSelect ||
  !resultsContainer ||
  !messagesContainer ||
  !barChartContainer ||
  !overlayContainer ||
  !overlayHero ||
  !visualisationSection
) {
  throw new Error('Calculator UI failed to initialise')
}

const DEG_PER_RAD = 180 / Math.PI

const parseFocalLengths = (rawValue: string): { values: number[]; invalidTokens: string[] } => {
  const tokens = rawValue
    .split(/[\s,;]+/)
    .map((token) => token.trim())
    .filter(Boolean)

  if (tokens.length === 0) {
    return { values: [], invalidTokens: [] }
  }

  const values = new Set<number>()
  const invalidTokens: string[] = []

  tokens.forEach((token) => {
    const numericPart = token.replace(/mm$/i, '')
    const parsed = Number.parseFloat(numericPart)

    if (!Number.isFinite(parsed) || parsed <= 0) {
      invalidTokens.push(token)
      return
    }

    values.add(Math.round(parsed * 10) / 10)
  })

  return {
    values: Array.from(values).sort((a, b) => a - b),
    invalidTokens,
  }
}

const degreesFromRadians = (value: number): number => value * DEG_PER_RAD

const calculateAngles = (focalLength: number, sensorWidth: number, sensorHeight: number): AngleOfView => {
  const horizontal = degreesFromRadians(2 * Math.atan(sensorWidth / (2 * focalLength)))
  const vertical = degreesFromRadians(2 * Math.atan(sensorHeight / (2 * focalLength)))
  const diagonal = degreesFromRadians(
    2 * Math.atan(Math.sqrt(sensorWidth ** 2 + sensorHeight ** 2) / (2 * focalLength)),
  )

  return { focal: focalLength, horizontal, vertical, diagonal }
}

const getSelectedSensor = (): { width: number; height: number } | null => {
  const selectedValue = sensorOptionInputs.find((input) => input.checked)?.value
  const selected = SENSOR_OPTIONS.find((option) => option.id === selectedValue)
  if (!selected) {
    return null
  }

  if (!selected.isCustom) {
    return { width: selected.width, height: selected.height }
  }

  const width = Number.parseFloat(customWidthInput.value)
  const height = Number.parseFloat(customHeightInput.value)

  if (!Number.isFinite(width) || width <= 0 || !Number.isFinite(height) || height <= 0) {
    return null
  }

  return { width, height }
}

const getSelectedSubject = (): SubjectSpec | null => {
  const selected = SUBJECT_OPTIONS.find((option) => option.id === subjectSelect.value)
  return selected ?? null
}

const formatAngle = (value: number): string => `${value.toFixed(1)} deg`

const capitalise = (value: string): string => (value.length > 0 ? value[0].toUpperCase() + value.slice(1) : value)

const renderMessages = (
  invalidTokens: string[],
  sensorValid: boolean,
  valuesProvided: boolean,
  distanceValid: boolean,
  subjectValid: boolean,
) => {
  const fragments: string[] = []

  if (!valuesProvided) {
    fragments.push('Add at least one focal length to see the results.')
  }

  if (invalidTokens.length > 0) {
    fragments.push(`Could not parse: ${invalidTokens.join(', ')}`)
  }

  if (!sensorValid) {
    fragments.push('Set a valid sensor size for calculations.')
  }

  if (!distanceValid) {
    fragments.push('Enter a valid subject distance in meters.')
  }

  if (!subjectValid) {
    fragments.push('Select a subject type.')
  }

  messagesContainer.innerHTML = fragments.length ? `<p>${fragments.join(' ')}</p>` : ''
}

const formatSubjectCount = (value: number, subject: SubjectSpec): string => {
  if (value <= 0) {
    return `0 ${subject.plural}`
  }
  if (value === 1) {
    return `1 ${subject.singular}`
  }
  return `${value} ${subject.plural}`
}

const renderResults = (metrics: LensMetrics[], subject: SubjectSpec) => {
  if (metrics.length === 0) {
    resultsContainer.innerHTML = ''
    // set display none to results and visualisation sections via css and styling:
    resultsContainer.hidden = true;
    visualisationSection.hidden = true
    overlayHero.hidden = true
    return
  }

  // remove hidden attribute
  resultsContainer.hidden = false;
  visualisationSection.hidden = false
  overlayHero.hidden = false

  const tableRows = metrics
    .map(
      (metric) => `
        <tr>
          <th scope="row">${metric.focal.toFixed(1)} mm</th>
          <td>${formatAngle(metric.horizontal)}</td>
          <td>${formatAngle(metric.vertical)}</td>
          <td>${formatAngle(metric.diagonal)}</td>
          <td>${formatSubjectCount(metric.subjectsAcross, subject)}</td>
        </tr>
      `,
    )
    .join('')

  const cards = metrics
    .map(
      (metric) => `
        <article class="result-card">
          <header>
            <h3>${metric.focal.toFixed(1)} mm</h3>
          </header>
          <dl>
            <div>
              <dt>Horizontal</dt>
              <dd>${formatAngle(metric.horizontal)}</dd>
            </div>
            <div>
              <dt>Vertical</dt>
              <dd>${formatAngle(metric.vertical)}</dd>
            </div>
            <div>
              <dt>Diagonal</dt>
              <dd>${formatAngle(metric.diagonal)}</dd>
            </div>
            <div>
              <dt>${capitalise(subject.plural)}</dt>
              <dd>${formatSubjectCount(metric.subjectsAcross, subject)}</dd>
            </div>
          </dl>
        </article>
      `,
    )
    .join('')

  resultsContainer.innerHTML = `
    <div class="results-table">
      <table>
        <thead>
          <tr>
            <th scope="col">Focal length</th>
            <th scope="col">Horizontal</th>
            <th scope="col">Vertical</th>
            <th scope="col">Diagonal</th>
            <th scope="col">${capitalise(subject.plural)} across</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
    </div>
    <div class="results-cards">${cards}</div>
  `
}

const renderBarChart = (metrics: LensMetrics[]) => {
  if (metrics.length === 0) {
    barChartContainer.innerHTML = ''
    return
  }

  const maxAngle = Math.max(...metrics.map((metric) => metric.horizontal))
  const barMarkup = metrics
    .map((metric) => {
      const percentage = (metric.horizontal / maxAngle) * 100
      return `
        <div class="bar">
          <div class="bar-label">${metric.focal.toFixed(1)} mm</div>
          <div class="bar-track">
            <div class="bar-fill" style="width: ${percentage}%">
              <span>${formatAngle(metric.horizontal)} (${percentage.toFixed(2)} %)</span>
            </div>
          </div>
        </div>
      `
    })
    .join('')

  barChartContainer.innerHTML = barMarkup
}

const COLOURS = [
  '#22d3ee',
  '#60a5fa',
  '#a855f7',
  '#f97316',
  '#f43f5e',
  '#10b981',
] as const

const renderOverlay = (metrics: LensMetrics[], subject: SubjectSpec, distance: number | null) => {
  if (metrics.length === 0 || distance === null) {
    overlayContainer.innerHTML = ''

    return
  }

  const sorted = [...metrics].sort((a, b) => b.horizontal - a.horizontal)
  const width = 900
  const height = 560
  const subjectBandHeight = Math.round(height * 0.23)
  const centerX = width / 2
  const baseY = height - 30
  const wedgeTopY = Math.max(subjectBandHeight + 80, Math.round(height * 0.35))
  const visualDepth = Math.max(280, baseY - wedgeTopY)
  const maxSpreadCap = width * 0.48

  const angleData = sorted.map((metric, index) => {
    const halfAngleRad = ((metric.horizontal / 2) * Math.PI) / 180
    const spreadXRaw = Math.tan(halfAngleRad) * visualDepth
    const spreadX = Math.min(spreadXRaw, maxSpreadCap)
    return {
      metric,
      halfAngleRad,
      spreadX,
      colour: COLOURS[index % COLOURS.length],
    }
  })

  const widestFrameMeters = Math.max(...sorted.map((metric) => metric.frameWidthMeters), 0)

  const overlays = angleData
    .map((entry, index) => {
      const topY = wedgeTopY
      const leftX = centerX - entry.spreadX
      const rightX = centerX + entry.spreadX

      return `
        <polygon
          points="${centerX},${baseY} ${leftX},${topY} ${rightX},${topY}"
          fill="${entry.colour}"
          fill-opacity="${0.16 + index * 0.08}"
          stroke="${entry.colour}"
          stroke-width="2"
        >
          <title>${entry.metric.focal.toFixed(1)} mm — ${formatAngle(entry.metric.horizontal)} horizontal</title>
        </polygon>
      `
    })
    .join('')

  const maxSubjectsAcross = Math.max(...sorted.map((metric) => metric.subjectsAcross), 0)
  const displaySubjects = Math.min(maxSubjectsAcross, 88)
  const overflowSubjects = Math.max(maxSubjectsAcross - displaySubjects, 0)
  const maxColumnsPerRow = 28
  const desiredRows = Math.min(4, Math.max(1, Math.ceil(displaySubjects / maxColumnsPerRow)))
  const safeColumns = Math.max(1, Math.min(maxColumnsPerRow, Math.ceil(displaySubjects / desiredRows)))
  const rows = Math.max(1, Math.ceil(displaySubjects / safeColumns))
  const coverageRatios = angleData.map((entry) =>
    widestFrameMeters === 0 ? 0 : entry.metric.frameWidthMeters / widestFrameMeters,
  )
  const colourForOffset = (offset: number): string => {
    for (let idx = angleData.length - 1; idx >= 0; idx -= 1) {
      if (offset <= coverageRatios[idx] / 2) {
        return angleData[idx].colour
      }
    }
    return '#94a3b8'
  }
  const maxSpread = Math.max(...angleData.map((entry) => entry.spreadX), 160)
  const gridWidthPx = Math.max(320, Math.min(maxSpread * 1.75, width * 0.88))
  const baseIconHeight = 42
  const availableHeight = Math.max(72, subjectBandHeight - 32)
  const rowGapPx = Math.max(10, Math.min(24, availableHeight / rows * 0.18))
  let iconScale = Math.min(
    1.8,
    Math.max(
      0.6,
      (availableHeight - Math.max(rows - 1, 0) * rowGapPx) / (rows * baseIconHeight),
    ),
  )
  let iconHeightPx = baseIconHeight * iconScale
  let totalSubjectHeight = rows * iconHeightPx + Math.max(rows - 1, 0) * rowGapPx
  const gridTopPx = 28
  const maxAllowedHeight = Math.max(48, wedgeTopY - gridTopPx - 32)

  if (totalSubjectHeight > maxAllowedHeight) {
    const adjustedScale = (maxAllowedHeight - Math.max(rows - 1, 0) * rowGapPx) / (rows * baseIconHeight)
    iconScale = Math.max(0.55, Math.min(iconScale, adjustedScale))
    iconHeightPx = baseIconHeight * iconScale
    totalSubjectHeight = rows * iconHeightPx + Math.max(rows - 1, 0) * rowGapPx
  }


  const columnGapPx = Math.max(14, Math.min(28, (gridWidthPx / safeColumns) * 0.18))
  const iconMarkup = subject.icon.trim()

  const subjectsGridContent =
    displaySubjects > 0
      ? Array.from({ length: displaySubjects })
          .map((_, index) => {
            const columnIndex = index % safeColumns
            const normalized = (columnIndex + 0.5) / safeColumns
            const offset = Math.abs(normalized - 0.5)
            const colour = colourForOffset(offset)
            return `
              <span
                class="overlay-subject"
                data-row="${Math.floor(index / safeColumns)}"
                style="color: ${colour}; animation-delay: ${index * 22}ms"
              >
                ${iconMarkup}
              </span>
            `
          })
          .join('')
      : '<span class="overlay-subject-empty">Move closer to fit one into frame</span>'

  const overflowBadgeMarkup =
    overflowSubjects > 0
      ? `<span class="overlay-subject-more">+${overflowSubjects} ${
          overflowSubjects === 1 ? subject.singular : subject.plural
        }</span>`
      : ''

  const markers = angleData
    .map((entry) => {
      return `
        <div class="legend-item">
          <span class="swatch" style="background:${entry.colour}"></span>
          <span>${entry.metric.focal.toFixed(1)} mm</span>
        </div>
      `
    })
    .join('')

  overlayContainer.innerHTML = `
    <div class="overlay-stage">
      <svg viewBox="0 0 ${width} ${height}" role="presentation" aria-hidden="true">
        <defs>
          <marker
            id="center-dot"
            markerWidth="6"
            markerHeight="6"
            refX="3"
            refY="3"
          >
            <circle cx="3" cy="3" r="3" fill="#475569" />
          </marker>
        </defs>
        <line
          x1="${centerX}"
          y1="${baseY}"
          x2="${centerX}"
          y2="${wedgeTopY}"
          stroke="#cbd5f5"
          stroke-width="2"
          stroke-dasharray="6"
        />
        ${overlays}
        <circle cx="${centerX}" cy="${baseY}" r="4" fill="#334155" />
      </svg>
      <div class="overlay-subject-layer" aria-hidden="true">
        ${
          displaySubjects > 0 || overflowSubjects > 0
            ? `
              <div
                class="overlay-subject-block"
                style="
                  --grid-width: ${gridWidthPx}px;
                  --grid-top: ${gridTopPx}px;
                  --icon-scale: ${iconScale};
                  --row-gap: ${rowGapPx}px;
                  --column-gap: ${columnGapPx}px;
                "
              >
                <div class="overlay-subject-grid" style="--columns: ${safeColumns}; --rows: ${rows};">
                  ${subjectsGridContent}
                </div>
                ${
                  overflowBadgeMarkup
                    ? `<div class="overlay-subject-meta">${overflowBadgeMarkup}</div>`
                    : ''
                }
              </div>
            `
            : ''
        }
      </div>
    </div>
    <div class="overlay-legend legend" aria-hidden="true">${markers}</div>
  `
}

const updateResults = () => {
  const { values, invalidTokens } = parseFocalLengths(focalInput.value)
  const sensor = getSelectedSensor()
  const sensorValid = sensor !== null
  const distanceRaw = distanceInput.value.trim()
  const distance = distanceRaw === '' ? NaN : Number.parseFloat(distanceRaw)
  const distanceValid = Number.isFinite(distance) && distance > 0
  const distanceValue = distanceValid ? distance : null
  const subject = getSelectedSubject()
  const subjectValid = subject !== null
  const selectedSubject = subject ?? SUBJECT_OPTIONS[0]

  renderMessages(invalidTokens, sensorValid, values.length > 0, distanceValid, subjectValid)

  if (!sensorValid || !distanceValid || !subjectValid || values.length === 0) {
    renderResults([], selectedSubject)
    renderBarChart([])
    renderOverlay([], selectedSubject, null)
    return
  }

  const metrics = values.map((focal) => {
    const angles = calculateAngles(focal, sensor.width, sensor.height)
    const frameWidthMeters =
      distanceValue !== null
        ? 2 * distanceValue * Math.tan(((angles.horizontal * Math.PI) / 180) / 2)
        : 0
    const subjectsAcross =
      frameWidthMeters > 0 ? Math.max(0, Math.floor(frameWidthMeters / selectedSubject.widthMeters)) : 0
    return { ...angles, frameWidthMeters, subjectsAcross }
  })

  renderResults(metrics, selectedSubject)
  renderBarChart(metrics)
  renderOverlay(metrics, selectedSubject, distanceValue)
}

const handleSensorChange = () => {
  const selectedId = sensorOptionInputs.find((input) => input.checked)?.value
  const selected = SENSOR_OPTIONS.find((option) => option.id === selectedId)
  if (selected?.isCustom) {
    customSensorContainer.hidden = false
    customWidthInput.focus()
  } else {
    customSensorContainer.hidden = true
    customWidthInput.value = ''
    customHeightInput.value = ''
  }
  updateResults()
}

sensorOptionInputs.forEach((input) => {
  input.addEventListener('change', handleSensorChange)
})

subjectSelect.addEventListener('change', () => {
  updateResults()
})

form.addEventListener('submit', (event) => {
  event.preventDefault()
  updateResults()
})

const interactiveInputs: HTMLInputElement[] = [focalInput, customWidthInput, customHeightInput, distanceInput]

interactiveInputs.forEach((element) => {
  element.addEventListener('input', () => {
    updateResults()
  })
})

updateResults()
