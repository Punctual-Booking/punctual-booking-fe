import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { LoginForm } from '@/components/auth/LoginForm'
import { RegisterForm } from '@/components/auth/RegisterForm'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { Image } from '@/components/ui/image'
import logo from '@/assets/images/homepage_logo.png'

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login')
  const { t } = useTranslation()

  return (
    <>
      <div className="container relative mx-auto flex min-h-screen flex-col items-center justify-center px-4">
        <LanguageSwitcher className="fixed right-4 top-4" />
        <Image
          src={logo}
          alt="Punctual Logo"
          className="mb-8 h-32 w-32 md:h-48 md:w-48"
          aspectRatio="square"
        />
        <Card className="w-full max-w-[350px]">
          <CardHeader>
            <CardTitle>{t('app.name')}</CardTitle>
            <CardDescription>{t('app.description')}</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="login">{t('auth.login')}</TabsTrigger>
                <TabsTrigger value="register">{t('auth.register')}</TabsTrigger>
              </TabsList>
              <TabsContent value="login">
                <LoginForm />
              </TabsContent>
              <TabsContent value="register">
                <RegisterForm />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </>
  )
}
