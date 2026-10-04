import { Button } from '@/components/ui/Button'
import { Checkbox } from '@/components/ui/Checkbox'
import { IconButton } from '@/components/ui/IconButton'
import { PasswordField } from '@/components/ui/PasswordField'
import { RadioGroup } from '@/components/ui/RadioGroup'
import { Select } from '@/components/ui/Select'
import { TextField } from '@/components/ui/TextField'
import { Textarea } from '@/components/ui/Textarea'
import { ShowcaseBlock, ShowcaseSection } from '../ShowcaseBlock'
import styles from './ControlsSection.module.scss'
import { MALPRACTICE_OPTIONS, SPECIALTY_OPTIONS } from './ControlsSection.state'

export const ControlsSection = () => (
  <ShowcaseSection
    id="controls"
    title="Actions & form controls"
    description="Every control takes label, hint, error and required, and passes react-hook-form's register() straight through."
  >
    <ShowcaseBlock
      title="Button"
      usage="One primary per view. Brand (gradient) only for the final Submit. Danger for delete."
      inline
    >
      <Button>Save &amp; Next</Button>
      <Button variant="brand" leftIcon="seal">
        Submit certification
      </Button>
      <Button variant="secondary" leftIcon="save">
        Save &amp; Exit
      </Button>
      <Button variant="outline">Continue</Button>
      <Button variant="ghost" leftIcon="arrowLeft">
        Back
      </Button>
      <Button variant="danger" leftIcon="delete">
        Delete
      </Button>
      <Button variant="dangerOutline">Reset progress</Button>
      <Button variant="link">View answers</Button>
    </ShowcaseBlock>

    <ShowcaseBlock title="Button sizes & states" inline>
      <Button size="sm">Small</Button>
      <Button size="md">Medium</Button>
      <Button size="lg">Large</Button>
      <Button isLoading>Saving</Button>
      <Button disabled>Disabled</Button>
      <IconButton icon="edit" label="Edit provider" />
      <IconButton icon="delete" label="Delete provider" variant="danger" />
      <IconButton icon="settings" label="Settings" variant="secondary" />
    </ShowcaseBlock>

    <ShowcaseBlock
      title="Text inputs"
      usage="TextField covers text, number and date. Errors replace the hint."
    >
      <div className={styles.grid}>
        <TextField label="Full legal name" placeholder="Dr. Meera Iyer" required />
        <TextField
          label="Board certificate number"
          defaultValue="BC-12"
          required
          error="Use the format BC- followed by 6 digits"
        />
        <TextField
          label="Passport expiry date"
          type="date"
          hint="At least 6 months from today"
          required
        />
        <TextField label="ADA member ID" optional placeholder="e.g. ADA4471" />
        <PasswordField label="Password" defaultValue="Pass@123" />
        <TextField label="Read-only" defaultValue="Locked after submission" readOnly />
      </div>
    </ShowcaseBlock>

    <ShowcaseBlock title="Select, textarea, radio, checkbox">
      <div className={styles.grid}>
        <Select
          label="Primary specialty"
          placeholder="Choose a specialty"
          options={SPECIALTY_OPTIONS}
          defaultValue=""
          required
        />
        <Textarea
          label="Explanation"
          hint="20–1000 characters"
          maxLength={1000}
          showCount
          rows={3}
          defaultValue="Claim filed in 2019, dismissed in 2020."
        />
      </div>
      <RadioGroup
        label="Any malpractice claims or disciplinary actions?"
        name="ds-malpractice"
        options={MALPRACTICE_OPTIONS}
        required
      />
      <Checkbox
        label="I attest that the information provided is true and complete."
        description="Required before you can submit."
      />
      <Checkbox label="Attestation (error state)" error="You must accept the attestation" />
    </ShowcaseBlock>
  </ShowcaseSection>
)
