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
import { LoginForm } from '@/components/authentication/LoginForm'
import { RegisterForm } from '@/components/authentication/RegisterForm'
import { LanguageSwitcher } from '@/components/common/LanguageSwitcher'
import { Image } from '@/components/ui/image'
import logo from '@/assets/images/logo_black.png'

export const AuthPage = () => {
  const [activeTab, setActiveTab] = useState('login')
  const { t } = useTranslation()

  return (
    <>
      <div className="container mx-auto flex flex-col items-center justify-center min-h-screen">
        <LanguageSwitcher />
        <Image
          src={logo}
          alt="Punctual Logo"
          className="w-32 h-32 mb-8"
          aspectRatio="square"
        />
        <Card className="w-[350px]">
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
